
import { database } from './db';

// This is a mock Supabase client to allow the application to run without
// a real backend connection for demonstration purposes.
// It simulates authentication using localStorage and checks against the local mock database.

const SESSION_KEY = 'hakkon_mock_session';

const getStoredSession = () => {
    try {
        const stored = localStorage.getItem(SESSION_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
};

const setStoredSession = (session: any) => {
    if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
        localStorage.removeItem(SESSION_KEY);
    }
};

type AuthListener = (event: string, session: any) => void;
const listeners: AuthListener[] = [];

const notifyListeners = (event: string, session: any) => {
    listeners.forEach(l => l(event, session));
};

export const supabase = {
    auth: {
        signInWithPassword: async ({ email, password }: any) => {
            // Check against the mock database in db.ts
            const user = database.findUserByEmail(email);
            if (user && user.password === password) {
                const session = {
                    access_token: 'mock-token-' + Date.now(),
                    user: {
                        id: user.id,
                        email: user.email,
                        user_metadata: {
                            name: user.name,
                            role: user.role,
                            avatar_url: user.avatar
                        }
                    }
                };
                setStoredSession(session);
                notifyListeners('SIGNED_IN', session);
                return { data: { user: session.user, session }, error: null };
            } else {
                return { 
                    data: { user: null, session: null }, 
                    error: { message: 'Invalid email or password (try fan@example.com / password)' } 
                };
            }
        },
        
        signUp: async ({ email, password, options }: any) => {
            // Simulate a successful signup. 
            // In the real app, this creates a user in Supabase Auth.
            // Here we just return success so App.tsx can handle the logic.
            
            if (database.findUserByEmail(email)) {
                return { data: { user: null }, error: { message: "User already exists" } };
            }

            const newUser = {
                id: `user-${Date.now()}`,
                email,
                user_metadata: options?.data || {}
            };
            
            // We don't sign in automatically to simulate email verification flow or just distinct steps
            return { data: { user: newUser }, error: null };
        },

        signInWithOAuth: async ({ provider }: any) => {
            // Simulate a Google Sign-In
            const randomId = Math.floor(Math.random() * 10000);
            const newUser = {
                id: `google-user-${randomId}`,
                email: `user${randomId}@gmail.com`,
                user_metadata: {
                    full_name: `Google User ${randomId}`,
                    avatar_url: `https://placehold.co/100x100/4285F4/FFFFFF?text=G`,
                    // Role is purposefully undefined to trigger the Role Chooser in App.tsx
                }
            };
            
            const session = {
                access_token: 'mock-oauth-token',
                user: newUser
            };
            
            setStoredSession(session);
            notifyListeners('SIGNED_IN', session);
            return { data: { session }, error: null };
        },

        signOut: async () => {
            setStoredSession(null);
            notifyListeners('SIGNED_OUT', null);
            return { error: null };
        },

        updateUser: async ({ data }: any) => {
            const session = getStoredSession();
            if (session) {
                session.user.user_metadata = { ...session.user.user_metadata, ...data };
                setStoredSession(session);
                // We don't strictly need to fire an auth event for metadata update, 
                // but updating local storage is key.
                return { data: { user: session.user }, error: null };
            }
            return { error: { message: "No active session" } };
        },

        onAuthStateChange: (callback: AuthListener) => {
            listeners.push(callback);
            const session = getStoredSession();
            // Fire immediately with current state
            setTimeout(() => {
                callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
            }, 0);

            return {
                data: {
                    subscription: {
                        unsubscribe: () => {
                            const index = listeners.indexOf(callback);
                            if (index > -1) listeners.splice(index, 1);
                        }
                    }
                }
            };
        }
    }
};
