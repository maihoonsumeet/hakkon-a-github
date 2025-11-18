import React, { useState, useEffect } from 'react';
import type { Club, PageContext, Post, User } from '@/types';
import { database } from '@/db-supabase';
import { auth } from '@/lib/auth';

import ComicBookStyles from '@/components/layout/ComicBookStyles';
import Modal from '@/components/shared/Modal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import LoginPage from '@/components/auth/LoginPage';
import SignUpPage from '@/components/auth/SignUpPage';
import RoleChooserPage from '@/components/auth/RoleChooserPage';

import FanDashboard from '@/components/fan/FanDashboard';
import FanProfilePage from '@/components/fan/FanProfilePage';
import ClubPublicView from '@/components/fan/ClubPublicView';
import PostDetailView from '@/components/fan/PostDetailView';

import CreatorDashboard from '@/components/creator/CreatorDashboard';
import CreateClubPage from '@/components/creator/CreateClubPage';
import ClubManagementPage from '@/components/creator/ClubManagementPage';

export default function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [appData, setAppData] = useState<{ clubs: Club[]; users: { [email: string]: User } }>({ 
        clubs: [], 
        users: {} 
    });
    const [isLoading, setIsLoading] = useState(true);
    const { clubs, users } = appData;

    // Navigation State
    const [page, setPage] = useState<string>('login');
    const [pageContext, setPageContext] = useState<PageContext>({});
    const [history, setHistory] = useState<{ page: string; pageContext: PageContext }[]>([]);
    
    // Auth State
    const [pendingUser, setPendingUser] = useState<{ name: string; email: string; password: string; authUserId?: string } | null>(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

    // --- AUTH LOGIC ---
    
    // Check for existing session on mount & Listen for auth changes
    useEffect(() => {
        const { data: authListener } = auth.onAuthStateChange(async (authUser) => {
            if (authUser) {
                try {
                    console.log("Auth user detected:", authUser.email);
                    
                    // 1. Try to find the user in the database
                    // We use the API directly to avoid triggering the "auto-create" logic prematurely
                    const existingUser = await database.findUserByEmail(authUser.email!);

                    if (existingUser) {
                        // CASE: User exists in DB! Log them in normally.
                        console.log("User found in DB, logging in...");
                        setCurrentUser(existingUser);
                        setHistory([]);
                        
                        // Navigate to dashboard only if we are on a login/auth page to avoid disrupting navigation
                        if (['login', 'signup', 'roleChooser'].includes(page)) {
                            navigateTo(existingUser.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
                        }
                    } else {
                        // CASE: User is NEW (Authenticated via Google/Email but not in 'users' table yet).
                        // Do NOT create them here. Send them to Role Chooser to pick Fan/Creator.
                        console.log("User not found in DB, redirecting to Role Chooser...");
                        
                        // Only redirect if we aren't already on a setup page to avoid loops
                        if (page !== 'roleChooser' && page !== 'signup') {
                            setPendingUser({ 
                                name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'New User', 
                                email: authUser.email!, 
                                password: '', 
                                authUserId: authUser.id 
                            });
                            navigateTo('roleChooser');
                        }
                    }
                } catch (error) {
                    console.error('Auth state change error:', error);
                    showAlert('LOGIN ERROR', 'Could not verify account. Please check console.');
                }
            } else {
                // No auth user (Logged out)
                setCurrentUser(null);
                if (page !== 'signup') {
                    setPage('login');
                }
            }
            setAuthLoading(false);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [page]);

    // --- DATA LOADING ---

    // Load initial data (Clubs, Posts, etc.)
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const state = await database.getState();
                setAppData(state);
            } catch (error) {
                console.error('Failed to load data:', error);
                // Only show alert if we are logged in, otherwise it might just be RLS blocking public access
                if (currentUser) {
                    showAlert('ERROR', 'Failed to load data from server. Please refresh.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        // Only load data if we aren't checking auth
        if (!authLoading) {
            loadData();
        }
    }, [authLoading, currentUser]); // Reload if auth state changes

    // Subscribe to real-time database changes
    useEffect(() => {
        const unsubscribe = database.subscribe(async () => {
            const state = await database.getState();
            setAppData(state);
        });
        return () => unsubscribe();
    }, []);


    const showAlert = (title: string, message: string) => {
        setModal({ isOpen: true, title, message });
    };

    const navigateTo = (pageName: string, context: PageContext = {}) => {
        setHistory(prev => [...prev, { page, pageContext }]);
        setPage(pageName);
        setPageContext(context);
    };

    const navigateBack = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setPage(lastState.page);
            setPageContext(lastState.pageContext);
            setHistory(prev => prev.slice(0, -1));
        }
    };
    
    const handleLogin = async (email: string, password: string) => {
        try {
            const { user } = await auth.signInWithPassword(email, password);
            if (user) {
                // The onAuthStateChange listener will handle the rest (DB check & redirect)
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Login error:', error);
            showAlert('ERROR', error.message || 'Failed to login. Please try again.');
            return false;
        }
    };

    const initiateSignUp = async (name: string, email: string, password: string) => {
        try {
            const { user } = await auth.signUp(email, password, name);
            if (user) {
                // Check if email confirmation is required
                if (user.identities && user.identities.length === 0) {
                    showAlert("CHECK EMAIL", "Please check your email to confirm your account.");
                    return false;
                }
                setPendingUser({ name, email, password, authUserId: user.id });
                navigateTo('roleChooser');
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Sign up error:', error);
            if (error.message?.includes('already registered')) {
                showAlert("WHOOPS!", "A user with this email already exists.");
            } else {
                showAlert('ERROR', error.message || 'Failed to create account. Please try again.');
            }
            return false;
        }
    };

    const completeSignUp = async (role: 'fan' | 'creator') => {
        if (!pendingUser) return;
        try {
            const authUser = await auth.getAuthUser();
            if (authUser) {
                // NOW we create the user in the DB, because we know the role
                const appUser = await auth.getOrCreateAppUser(authUser, role);
                setCurrentUser(appUser);
                setPendingUser(null);
                setHistory([]);
                navigateTo(role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
            }
        } catch (error) {
            console.error('Complete sign up error:', error);
            showAlert('ERROR', 'Failed to complete signup. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await auth.signInWithGoogle();
            // User will be redirected to external provider
        } catch (error: any) {
            console.error('Google sign in error:', error);
            showAlert('ERROR', error.message || 'Failed to sign in with Google. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            setCurrentUser(null);
            setPage('login');
            setPageContext({});
            setHistory([]);
        } catch (error) {
            console.error('Logout error:', error);
            showAlert('ERROR', 'Failed to logout. Please try again.');
        }
    }

    const handleUpdateUser = async (updatedUser: User) => {
        try {
            setCurrentUser(updatedUser);
            await database.updateUser(updatedUser);
        } catch (error) {
            console.error('Update user error:', error);
            showAlert('ERROR', 'Failed to update profile. Please try again.');
        }
    }

    const handleToggleFollow = async (clubId: number) => {
        if (!currentUser) return;
        try {
            const isFollowing = currentUser.followedClubs.includes(clubId);
            const updatedFollowedClubs = isFollowing
                ? currentUser.followedClubs.filter(id => id !== clubId)
                : [...currentUser.followedClubs, clubId];

            const updatedUser = { ...currentUser, followedClubs: updatedFollowedClubs };
            setCurrentUser(updatedUser);
            
            await database.toggleFollow(currentUser.id, clubId, isFollowing);
        } catch (error) {
            console.error('Toggle follow error:', error);
            showAlert('ERROR', 'Failed to update follow status. Please try again.');
        }
    };

    const handleAddPost = async (clubId: number, newPostData: { text: string; image: string | null; }) => {
        try {
            await database.addPost(clubId, newPostData);
        } catch (error) {
            console.error('Add post error:', error);
            showAlert('ERROR', 'Failed to create post. Please try again.');
        }
    };

    const handleDeletePost = async (clubId: number, postId: number) => {
        try {
            await database.deletePost(clubId, postId);
        } catch (error) {
            console.error('Delete post error:', error);
            showAlert('ERROR', 'Failed to delete post. Please try again.');
        }
    };

    const handleAddComment = async (clubId: number, postId: number, commentText: string) => {
        if (!currentUser) return;
        try {
            await database.addComment(clubId, postId, commentText, currentUser);
        } catch (error) {
            console.error('Add comment error:', error);
            showAlert('ERROR', 'Failed to add comment. Please try again.');
        }
    };

    const handleDeleteComment = async (clubId: number, postId: number, commentId: number) => {
        try {
            await database.deleteComment(clubId, postId, commentId);
        } catch (error) {
            console.error('Delete comment error:', error);
            showAlert('ERROR', 'Failed to delete comment. Please try again.');
        }
    };

    const handleAddPlayer = async (clubId: number, newPlayerData: { name: string; position: string; avatar: string; }) => {
        try {
            await database.addPlayer(clubId, newPlayerData);
        } catch (error) {
            console.error('Add player error:', error);
            showAlert('ERROR', 'Failed to add player. Please try again.');
        }
    };

    const handleUpdateClub = async (updatedClub: Club) => {
        try {
            await database.updateClub(updatedClub);
            showAlert("POW!", "Club settings saved successfully!");
        } catch (error) {
            console.error('Update club error:', error);
            showAlert('ERROR', 'Failed to update club. Please try again.');
        }
    };

    const handleCreateClub = async (newClubData: Omit<Club, 'id' | 'creatorId' | 'players' | 'funding' | 'merch' | 'posts'>) => {
        if (!currentUser) return;
        try {
            const clubWithCreator = {
                ...newClubData,
                creatorId: currentUser.id,
            };
            
            await database.addClub(clubWithCreator);

            // Refresh data to get the new club with ID
            const state = await database.getState();
            setAppData(state);
            
            // Update current user's managed clubs
            const updatedUser = await database.findUserByEmail(currentUser.email);
            if (updatedUser) {
                setCurrentUser(updatedUser);
            }

            navigateTo('creatorDashboard');
        } catch (error) {
            console.error('Create club error:', error);
            showAlert('ERROR', 'Failed to create club. Please try again.');
        }
    };

    const allUsers = Object.values(users);

    // Show loading state during auth check
    if (authLoading) {
        return (
            <div className="comic-book-style min-h-screen flex items-center justify-center">
                <ComicBookStyles />
                <div className="text-center">
                    <h1 className="text-6xl mb-4">LOADING...</h1>
                    <p className="text-xl">Checking your credentials!</p>
                </div>
            </div>
        );
    }

    const renderPage = () => {
        if (!currentUser) {
            switch (page) {
                case 'signup': return <SignUpPage onInitiateSignUp={initiateSignUp} navigateTo={navigateTo} onGoogleSignIn={handleGoogleSignIn} />;
                case 'roleChooser': return <RoleChooserPage onCompleteSignUp={completeSignUp} />;
                default: return <LoginPage onLogin={handleLogin} navigateTo={navigateTo} onGoogleSignIn={handleGoogleSignIn} />;
            }
        }

        const { clubId, postId } = pageContext;
        const selectedClub = clubs.find(c => c.id === clubId);
        const selectedPost = selectedClub?.posts.find(p => p.id === postId);

        switch (page) {
            case 'fanDashboard': return <FanDashboard currentUser={currentUser} clubs={clubs} navigateTo={navigateTo} users={allUsers} onAddComment={handleAddComment} onDeletePost={handleDeletePost} onDeleteComment={handleDeleteComment} />;
            case 'creatorDashboard': return <CreatorDashboard currentUser={currentUser} clubs={clubs} navigateTo={navigateTo} />;
            case 'createClub': return <CreateClubPage onCreateClub={handleCreateClub} navigateTo={navigateTo} showAlert={showAlert} />;
            case 'clubManagement': 
                return selectedClub ? <ClubManagementPage club={selectedClub} onAddPost={handleAddPost} onAddPlayer={handleAddPlayer} onUpdateClub={handleUpdateClub} onDeletePost={handleDeletePost} /> : <div>Club not found</div>;
            case 'clubPublicView': 
                return selectedClub ? <ClubPublicView club={selectedClub} navigateTo={navigateTo} users={allUsers} onAddComment={handleAddComment} currentUser={currentUser} onToggleFollow={handleToggleFollow} onDeletePost={handleDeletePost} onDeleteComment={handleDeleteComment} /> : <div>Club not found</div>;
            case 'fanProfile': return <FanProfilePage user={currentUser} onUpdateUser={handleUpdateUser} />;
            case 'postDetail': 
                return (selectedPost && selectedClub) ? <PostDetailView post={selectedPost} club={selectedClub} navigateBack={navigateBack} users={allUsers} onAddComment={handleAddComment} currentUser={currentUser} onDeletePost={handleDeletePost} onDeleteComment={handleDeleteComment} /> : <div>Post not found</div>;
            default: return <LoginPage onLogin={handleLogin} navigateTo={navigateTo} onGoogleSignIn={handleGoogleSignIn} />;
        }
    };

    return (
        <div className="comic-book-style min-h-screen">
            <ComicBookStyles />
            {modal.isOpen && <Modal title={modal.title} message={modal.message} onClose={() => setModal({ isOpen: false, title: '', message: '' })} />}
            {currentUser && <Header user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} />}
            <main className="container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            {currentUser && <Footer />}
        </div>
    );
}