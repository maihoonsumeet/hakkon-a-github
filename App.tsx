import React, { useState, useEffect } from 'react';
import type { Club, PageContext, User, Theme } from './types';
import { database } from './db-supabase';
import { auth } from './lib/auth';

import ThemeStyles from './components/layout/ThemeStyles';
import Modal from './components/shared/Modal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import RoleChooserPage from './components/auth/RoleChooserPage';

import FanDashboard from './components/fan/FanDashboard';
import FanProfilePage from './components/fan/FanProfilePage';
import ClubPublicView from './components/fan/ClubPublicView';
import PostDetailView from './components/fan/PostDetailView';

import CreatorDashboard from './components/creator/CreatorDashboard';
import CreateClubPage from './components/creator/CreateClubPage';
import ClubManagementPage from './components/creator/ClubManagementPage';

export default function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [currentTheme, setCurrentTheme] = useState<Theme>('modern');

    const [appData, setAppData] = useState<{ clubs: Club[]; users: { [email: string]: User } }>({
        clubs: [],
        users: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    const { clubs, users } = appData;

    const [page, setPage] = useState<string>('login');
    const [pageContext, setPageContext] = useState<PageContext>({});
    const [history, setHistory] = useState<{ page: string; pageContext: PageContext }[]>([]);
    const [pendingUser, setPendingUser] = useState<{ name: string; email: string; password: string; authUserId?: string } | null>(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

    // Apply theme class to body
    useEffect(() => {
        document.body.classList.remove('theme-comic', 'theme-colour', 'theme-modern');
        document.body.classList.add(`theme-${currentTheme}`);
    }, [currentTheme]);

    // Auth listener
    useEffect(() => {
        const { data: authListener } = auth.onAuthStateChange(async (authUser: any) => {
            if (authUser) {
                try {
                    const existingUser = await database.findUserByEmail(authUser.email!);
                    if (existingUser) {
                        setCurrentUser(existingUser);
                        setHistory([]);
                        if (['login', 'signup', 'roleChooser'].includes(page)) {
                            navigateTo(existingUser.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
                        }
                    } else {
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
                    showAlert('LOGIN ERROR', 'Could not verify account. Please check the console.');
                }
            } else {
                setCurrentUser(null);
                if (page !== 'signup') setPage('login');
            }
            setAuthLoading(false);
        });

        return () => { authListener?.subscription.unsubscribe(); };
    }, [page]);

    // Load data once auth resolves
    useEffect(() => {
        if (authLoading) return;
        const loadData = async () => {
            try {
                setIsLoading(true);
                const state = await database.getState();
                setAppData(state);
            } catch (error) {
                console.error('Failed to load data:', error);
                if (currentUser) showAlert('ERROR', 'Failed to load data from server. Please refresh.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [authLoading, currentUser]);

    // Subscribe to realtime changes
    useEffect(() => {
        const unsubscribe = database.subscribe(async () => {
            const state = await database.getState();
            setAppData(state);
        });
        return () => unsubscribe();
    }, []);

    const showAlert = (title: string, message: string) => setModal({ isOpen: true, title, message });

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
            return !!user;
        } catch (error: any) {
            showAlert('ERROR', error.message || 'Failed to login. Please try again.');
            return false;
        }
    };

    const initiateSignUp = async (name: string, email: string, password: string) => {
        try {
            const { user } = await auth.signUp(email, password, name);
            if (user) {
                if (user.identities && user.identities.length === 0) {
                    showAlert('CHECK EMAIL', 'Please confirm your email before logging in.');
                    return false;
                }
                setPendingUser({ name, email, password, authUserId: user.id });
                navigateTo('roleChooser');
                return true;
            }
            return false;
        } catch (error: any) {
            if (error.message?.includes('already registered')) {
                showAlert('WHOOPS!', 'A user with this email already exists.');
            } else {
                showAlert('ERROR', error.message || 'Failed to create account.');
            }
            return false;
        }
    };

    const completeSignUp = async (role: 'fan' | 'creator') => {
        if (!pendingUser) return;
        try {
            const authUser = await auth.getAuthUser();
            if (authUser) {
                const appUser = await auth.getOrCreateAppUser(authUser, role);
                setCurrentUser(appUser);
                setPendingUser(null);
                setHistory([]);
                navigateTo(role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
            }
        } catch (error) {
            showAlert('ERROR', 'Failed to complete signup. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await auth.signInWithGoogle();
        } catch (error: any) {
            showAlert('ERROR', error.message || 'Failed to sign in with Google.');
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            setCurrentUser(null);
            setPage('login');
            setPageContext({});
            setHistory([]);
        } catch (error: any) {
            showAlert('ERROR', 'Failed to logout. Please try again.');
        }
    };

    const handleUpdateUser = async (updatedUser: User) => {
        try {
            setCurrentUser(updatedUser);
            await database.updateUser(updatedUser);
        } catch (error) {
            showAlert('ERROR', 'Failed to update profile. Please try again.');
        }
    };

    const handleToggleFollow = async (clubId: number) => {
        if (!currentUser) return;
        try {
            const isFollowing = currentUser.followedClubs.includes(clubId);
            const updatedFollowedClubs = isFollowing
                ? currentUser.followedClubs.filter(id => id !== clubId)
                : [...currentUser.followedClubs, clubId];
            setCurrentUser({ ...currentUser, followedClubs: updatedFollowedClubs });
            await database.toggleFollow(currentUser.id, clubId, isFollowing);
        } catch (error) {
            showAlert('ERROR', 'Failed to update follow status. Please try again.');
        }
    };

    const handleAddPost = async (clubId: number, newPostData: { text: string; image: string | null }) => {
        try { await database.addPost(clubId, newPostData); }
        catch (error) { showAlert('ERROR', 'Failed to create post. Please try again.'); }
    };

    const handleDeletePost = async (clubId: number, postId: number) => {
        try { await database.deletePost(clubId, postId); }
        catch (error) { showAlert('ERROR', 'Failed to delete post. Please try again.'); }
    };

    const handleAddComment = async (clubId: number, postId: number, commentText: string) => {
        if (!currentUser) return;
        try { await database.addComment(clubId, postId, commentText, currentUser); }
        catch (error) { showAlert('ERROR', 'Failed to add comment. Please try again.'); }
    };

    const handleDeleteComment = async (clubId: number, postId: number, commentId: number) => {
        try { await database.deleteComment(clubId, postId, commentId); }
        catch (error) { showAlert('ERROR', 'Failed to delete comment. Please try again.'); }
    };

    const handleAddPlayer = async (clubId: number, newPlayerData: { name: string; position: string; avatar: string }) => {
        try { await database.addPlayer(clubId, newPlayerData); }
        catch (error) { showAlert('ERROR', 'Failed to add player. Please try again.'); }
    };

    const handleUpdateClub = async (updatedClub: Club) => {
        try {
            await database.updateClub(updatedClub);
            showAlert('POW!', 'Club settings saved successfully!');
        } catch (error) {
            showAlert('ERROR', 'Failed to update club. Please try again.');
        }
    };

    const handleCreateClub = async (newClubData: Omit<Club, 'id' | 'creatorId' | 'players' | 'funding' | 'merch' | 'posts'>) => {
        if (!currentUser) return;
        try {
            await database.addClub({ ...newClubData, creatorId: currentUser.id });
            const state = await database.getState();
            setAppData(state);
            const updatedUser = await database.findUserByEmail(currentUser.email);
            if (updatedUser) setCurrentUser(updatedUser);
            navigateTo('creatorDashboard');
        } catch (error) {
            showAlert('ERROR', 'Failed to create club. Please try again.');
        }
    };

    const allUsers = Object.values(users);

    if (authLoading) {
        return (
            <div className="app-container min-h-screen flex items-center justify-center">
                <ThemeStyles />
                <div className="text-center p-12">
                    <h1 className="text-4xl font-bangers">LOADING HQ...</h1>
                    <p className="text-lg mt-2">Checking your credentials!</p>
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

        if (isLoading && clubs.length === 0) {
            return <div className="text-center p-12"><h1 className="text-4xl font-bangers">LOADING DATA...</h1></div>;
        }

        const { clubId, postId } = pageContext;
        const selectedClub = clubs.find(c => c.id === clubId);
        const selectedPost = selectedClub?.posts.find(p => p.id === postId);

        switch (page) {
            case 'fanDashboard':
                return <FanDashboard currentUser={currentUser} clubs={clubs} navigateTo={navigateTo} users={allUsers} onAddComment={handleAddComment} onDeletePost={handleDeletePost} onDeleteComment={handleDeleteComment} />;
            case 'creatorDashboard':
                return <CreatorDashboard currentUser={currentUser} clubs={clubs} navigateTo={navigateTo} />;
            case 'createClub':
                return <CreateClubPage onCreateClub={handleCreateClub} navigateTo={navigateTo} showAlert={showAlert} />;
            case 'clubManagement':
                return selectedClub
                    ? <ClubManagementPage club={selectedClub} onAddPost={handleAddPost} onAddPlayer={handleAddPlayer} onUpdateClub={handleUpdateClub} onDeletePost={handleDeletePost} />
                    : <div className="text-center p-12">Club not found</div>;
            case 'clubPublicView':
                return selectedClub
                    ? <ClubPublicView club={selectedClub} navigateTo={navigateTo} users={allUsers} onAddComment={handleAddComment} currentUser={currentUser} onToggleFollow={handleToggleFollow} onDeletePost={handleDeletePost} onDeleteComment={handleDeleteComment} />
                    : <div className="text-center p-12">Club not found</div>;
            case 'fanProfile':
                return <FanProfilePage user={currentUser} onUpdateUser={handleUpdateUser} />;
            case 'postDetail':
                return (selectedPost && selectedClub)
                    ? <PostDetailView post={selectedPost} club={selectedClub} navigateBack={navigateBack} users={allUsers} onAddComment={handleAddComment} currentUser={currentUser} onDeletePost={handleDeletePost} onDeleteComment={handleDeleteComment} />
                    : <div className="text-center p-12">Post not found</div>;
            default:
                return <FanDashboard currentUser={currentUser} clubs={clubs} navigateTo={navigateTo} users={allUsers} onAddComment={handleAddComment} onDeletePost={handleDeletePost} onDeleteComment={handleDeleteComment} />;
        }
    };

    return (
        <div className="app-container min-h-screen">
            <ThemeStyles />
            {modal.isOpen && <Modal title={modal.title} message={modal.message} onClose={() => setModal({ isOpen: false, title: '', message: '' })} />}
            {currentUser && <Header user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} currentTheme={currentTheme} setTheme={setCurrentTheme} />}
            <main className="container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            {currentUser && <Footer />}
        </div>
    );
}
