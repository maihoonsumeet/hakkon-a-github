
import React, { useState, useEffect } from 'react';
import type { Club, PageContext, Post, User } from './types';
import { database } from './db'; // Import the new database module

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
    // Current user state is still local and persisted for session management
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('hakkon_currentUser');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Failed to parse currentUser from localStorage", error);
            return null;
        }
    });

    // Central application data (clubs, users) comes from our database module
    const [appData, setAppData] = useState(database.getState());
    const { clubs, users } = appData;

    // Subscribe to database changes to keep the UI in sync
    useEffect(() => {
        const unsubscribe = database.subscribe(() => {
            setAppData(database.getState());
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Persist only the current logged-in user to localStorage
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
    
    // --- Authentication and User Management ---
    // All functions now interact with the `database` module instead of local state.
    
    const handleLogin = (email: string, password: string) => {
        const user = database.findUserByEmail(email);
        if (user && user.password === password) {
            setCurrentUser(user);
            setHistory([]);
            navigateTo(user.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
            return true;
        }
        return false;
    };

    const initiateSignUp = (name: string, email: string, password: string) => {
        if (database.findUserByEmail(email)) {
            showAlert("WHOOPS!", "A user with this email already exists.");
            return false;
        }
        setPendingUser({ name, email, password });
        navigateTo('roleChooser');
        return true;
    };

    const completeSignUp = (role: 'fan' | 'creator') => {
        if (!pendingUser) return;
        const { name, email, password } = pendingUser;
        const newId = `user_${Date.now()}`;
        const newUser: User = { id: newId, name, email, password, role, avatar: `https://placehold.co/100x100/A78BFA/FFFFFF?text=${name.charAt(0)}`, bio: '', followedClubs: [], managedClubs: [] };

        database.addUser(newUser);
        setCurrentUser(newUser);
        setPendingUser(null);
        setHistory([]);
        navigateTo(role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
    };

    const handleGoogleSignIn = () => {
        const googleUserEmail = 'google.user@example.com';
        const existingUser = database.findUserByEmail(googleUserEmail);

        if (existingUser) {
            setCurrentUser(existingUser);
            setHistory([]);
            navigateTo(existingUser.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
        } else {
            setPendingUser({ name: 'Googler', email: googleUserEmail, password: 'google_password' });
            navigateTo('roleChooser');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setPage('login');
        setPageContext({});
        setHistory([]);
    }

    const handleUpdateUser = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        database.updateUser(updatedUser);
    }

    const handleToggleFollow = (clubId: number) => {
        if (!currentUser) return;
        const isFollowing = currentUser.followedClubs.includes(clubId);
        const updatedFollowedClubs = isFollowing
            ? currentUser.followedClubs.filter(id => id !== clubId)
            : [...currentUser.followedClubs, clubId];

        const updatedUser = { ...currentUser, followedClubs: updatedFollowedClubs };
        handleUpdateUser(updatedUser);
    };

    // --- Data Mutation Handlers ---
    // These now just call the corresponding method on the database object.

    const handleAddPost = (clubId: number, newPostData: { text: string; image: string | null; }) => database.addPost(clubId, newPostData);

    const handleDeletePost = (clubId: number, postId: number) => database.deletePost(clubId, postId);

    const handleAddComment = (clubId: number, postId: number, commentText: string) => {
        if (!currentUser) return;
        database.addComment(clubId, postId, commentText, currentUser);
    };

    const handleDeleteComment = (clubId: number, postId: number, commentId: number) => database.deleteComment(clubId, postId, commentId);

    const handleAddPlayer = (clubId: number, newPlayerData: { name: string; position: string; avatar: string; }) => database.addPlayer(clubId, newPlayerData);

    const handleUpdateClub = (updatedClub: Club) => {
        database.updateClub(updatedClub);
        showAlert("POW!", "Club settings saved successfully!");
    };

    const handleCreateClub = (newClubData: Omit<Club, 'id' | 'creatorId' | 'players' | 'funding' | 'merch' | 'posts'>) => {
        if (!currentUser) return;
        const newClubId = Date.now();
        const newClub: Club = {
            id: newClubId,
            creatorId: currentUser.id,
            players: [],
            funding: { current: 0, goal: 10000 },
            merch: [],
            posts: [],
            ...newClubData
        };
        database.addClub(newClub);

        const updatedUser = {
            ...currentUser,
            managedClubs: [...currentUser.managedClubs, newClubId]
        };
        // This updates both currentUser in state and the user in the database
        handleUpdateUser(updatedUser);

        navigateTo('creatorDashboard');
    };

    const allUsers = Object.values(users);

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
