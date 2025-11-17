
import { initialMockClubs, initialMockUsers } from './data/mockData';
import type { Club, User, Post } from './types';

// Centralized state, initialized from mock data.
let clubs: Club[] = initialMockClubs;
let users: { [email: string]: User } = initialMockUsers;

// Load initial data from localStorage if it exists, to maintain persistence from the previous version.
// This acts as our "database persistence" layer. In a real app, this would be a fetch from an API.
try {
    const savedClubs = localStorage.getItem('hakkon_clubs');
    if (savedClubs) {
        const parsed = JSON.parse(savedClubs);
        clubs = parsed.map((club: Club) => ({
            ...club,
            posts: club.posts.map((post: Post) => ({ ...post, timestamp: new Date(post.timestamp) }))
        }));
    }
} catch (e) { console.error("Failed to load clubs from localStorage", e); }

try {
    const savedUsers = localStorage.getItem('hakkon_users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
} catch (e) { console.error("Failed to load users from localStorage", e); }

const subscribers: (() => void)[] = [];

// A function to persist the current state to localStorage, simulating a database save.
const persist = () => {
    localStorage.setItem('hakkon_clubs', JSON.stringify(clubs));
    localStorage.setItem('hakkon_users', JSON.stringify(users));
};

// A function to notify all subscribed components that the data has changed.
const notify = () => {
    persist(); // Save changes
    subscribers.forEach(callback => callback());
};

export const database = {
    /**
     * Subscribe to data changes.
     * @param callback The function to call when data changes.
     * @returns An unsubscribe function.
     */
    subscribe(callback: () => void) {
        subscribers.push(callback);
        return () => { // Return an unsubscribe function
            const index = subscribers.indexOf(callback);
            if (index > -1) subscribers.splice(index, 1);
        };
    },

    /**
     * Get the current state of the database.
     */
    getState() {
        return { clubs, users };
    },

    // --- Data Access & Mutation Methods ---

    findUserByEmail(email: string): User | undefined {
        return users[email];
    },

    addUser(newUser: User) {
        users[newUser.email] = newUser;
        notify();
    },

    updateUser(updatedUser: User) {
        if (users[updatedUser.email]) {
            users[updatedUser.email] = updatedUser;
            notify();
        }
    },

    addClub(newClub: Club) {
        clubs.push(newClub);
        notify();
    },

    updateClub(updatedClub: Club) {
        clubs = clubs.map(c => (c.id === updatedClub.id ? updatedClub : c));
        notify();
    },

    addPost(clubId: number, newPostData: { text: string; image: string | null; }) {
        clubs = clubs.map(c => c.id === clubId ? { ...c, posts: [{ ...newPostData, id: Date.now(), timestamp: new Date(), likes: 0, comments: [] }, ...c.posts] } : c);
        notify();
    },

    deletePost(clubId: number, postId: number) {
        clubs = clubs.map(club => {
            if (club.id === clubId) {
                return { ...club, posts: club.posts.filter(post => post.id !== postId) };
            }
            return club;
        });
        notify();
    },

    addComment(clubId: number, postId: number, commentText: string, currentUser: User) {
        clubs = clubs.map(club => {
            if (club.id === clubId) {
                const updatedPosts = club.posts.map(post => {
                    if (post.id === postId) {
                        const newComment = { id: Date.now(), userId: currentUser.id, text: commentText };
                        return { ...post, comments: [...post.comments, newComment] };
                    }
                    return post;
                });
                return { ...club, posts: updatedPosts };
            }
            return club;
        });
        notify();
    },

    deleteComment(clubId: number, postId: number, commentId: number) {
        clubs = clubs.map(club => {
            if (club.id === clubId) {
                const updatedPosts = club.posts.map(post => {
                    if (post.id === postId) {
                        return { ...post, comments: post.comments.filter(comment => comment.id !== commentId) };
                    }
                    return post;
                });
                return { ...club, posts: updatedPosts };
            }
            return club;
        });
        notify();
    },

    addPlayer(clubId: number, newPlayerData: { name: string; position: string; avatar: string; }) {
        clubs = clubs.map(club => {
            if (club.id === clubId) {
                return { ...club, players: [...club.players, { ...newPlayerData, id: Date.now() }] };
            }
            return club;
        });
        notify();
    }
};
