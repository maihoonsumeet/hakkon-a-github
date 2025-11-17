import React, { useState, useEffect } from 'react';
import type { Club, PageContext, Post, User } from './types';
import { database } from './supabase-db.ts'; // Changed from './db'

import ComicBookStyles from './components/layout/ComicBookStyles';
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
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('hakkon_currentUser');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Failed to parse currentUser from localStorage", error);
            return null;
        }
    });

    const [appData, setAppData] = useState<{ clubs: Club[]; users: { [email: string]: User } }>({ 
        clubs: [], 
        users: {} 
    });
    const [isLoading, setIsLoading] = useState(true);
    const { clubs, users } = appData;

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const state = await database.getState();
                setAppData(state);
            } catch (error) {
                console.error('Failed to load data:', error);
                showAlert('ERROR', 'Failed to load data from server. Please refresh.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Subscribe to database changes
    useEffect(() => {
        const unsubscribe = database.subscribe(async () => {
            const state = await database.getState();
            setAppData(state);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        localStorage.setItem('hakkon_currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    const [page, setPage] = useState(() => {
        if (currentUser) {
            return currentUser.role === 'fan' ? 'fanDashboard' : 'creatorDashboard';
        }
        return 'login';
    });

    const [pageContext, setPageContext] = useState<PageContext>({});
    const [history, setHistory] = useState<{ page: string; pageContext: PageContext }[]>([]);
    const [pendingUser, setPendingUser] = useState<{ name: string; email: string; password: string; } | null>(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

    const showAlert = (title: string, message: string) => {
        setModal({ isOpen: true, title, message });
    };

    const navigateTo = (pageName: string, context: PageContext = {}) => {
        setHistory([...history, { page, pageContext }]);
        setPage(pageName);
        setPageContext(context);
    };

    const navigateBack = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setPage(lastState.page);
            setPageContext(lastState.pageContext);
            setHistory(history.slice(0, -1));
        }
    };
    
    const handleLogin = async (email: string, password: string) => {
        try {
            const user = await database.findUserByEmail(email);
            if (user && user.password === password) {
                setCurrentUser(user);
                setHistory([]);
                navigateTo(user.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            showAlert('ERROR', 'Failed to login. Please try again.');
            return false;
        }
    };

    const initiateSignUp = async (name: string, email: string, password: string) => {
        try {
            const existingUser = await database.findUserByEmail(email);
            if (existingUser) {
                showAlert("WHOOPS!", "A user with this email already exists.");
                return false;
            }
            setPendingUser({ name, email, password });
            navigateTo('roleChooser');
            return true;
        } catch (error) {
            console.error('Sign up error:', error);
            showAlert('ERROR', 'Failed to check email. Please try again.');
            return false;
        }
    };

    const completeSignUp = async (role: 'fan' | 'creator') => {
        if (!pendingUser) return;
        try {
            const { name, email, password } = pendingUser;
            const newUser: Omit<User, 'id'> = {
                name,
                email,
                password,
                role,
                avatar: `https://placehold.co/100x100/A78BFA/FFFFFF?text=${name.charAt(0)}`,
                bio: '',
                followedClubs: [],
                managedClubs: []
            };

            await database.addUser(newUser);
            // Fetch the created user to get the ID
            const createdUser = await database.findUserByEmail(email);
            if (createdUser) {
                setCurrentUser(createdUser);
            }
            setPendingUser(null);
            setHistory([]);
            navigateTo(role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
        } catch (error) {
            console.error('Complete sign up error:', error);
            showAlert('ERROR', 'Failed to create account. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        const googleUserEmail = 'google.user@example.com';
        try {
            const existingUser = await database.findUserByEmail(googleUserEmail);

            if (existingUser) {
                setCurrentUser(existingUser);
                setHistory([]);
                navigateTo(existingUser.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
            } else {
                setPendingUser({ name: 'Googler', email: googleUserEmail, password: 'google_password' });
                navigateTo('roleChooser');
            }
        } catch (error) {
            console.error('Google sign in error:', error);
            showAlert('ERROR', 'Failed to sign in with Google. Please try again.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setPage('login');
        setPageContext({});
        setHistory([]);
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

    // Show loading state
    if (isLoading) {
        return (
            <div className="comic-book-style min-h-screen flex items-center justify-center">
                <ComicBookStyles />
                <div className="text-center">
                    <h1 className="text-6xl mb-4">LOADING...</h1>
                    <p className="text-xl">Fetching your awesome content!</p>
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