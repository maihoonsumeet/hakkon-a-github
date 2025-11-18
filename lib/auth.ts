import { supabase } from './supabase';
import type { User } from '../types';

export const auth = {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`, // Redirects back to your app
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // Store name in user metadata
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current Supabase auth user
   */
  async getAuthUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },

  /**
   * Convert Supabase auth user to app User type
   */
  async getOrCreateAppUser(authUser: any, role?: 'fan' | 'creator'): Promise<User> {
    // Check if user exists in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (existingUser) {
      // Get follows and managed clubs
      const { data: followedClubs } = await supabase
        .from('user_club_follows')
        .select('club_id')
        .eq('user_id', existingUser.id);

      const { data: managedClubs } = await supabase
        .from('clubs')
        .select('id')
        .eq('creator_id', existingUser.id);

      return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        password: existingUser.password,
        role: existingUser.role as 'fan' | 'creator',
        avatar: existingUser.avatar,
        bio: existingUser.bio,
        followedClubs: (followedClubs || []).map((f) => f.club_id),
        managedClubs: (managedClubs || []).map((c) => c.id),
      };
    }

    // Create new user in our users table
    const userName = authUser.user_metadata?.name || 
                     authUser.user_metadata?.full_name || 
                     authUser.email?.split('@')[0] || 
                     'User';
    
    const userAvatar = authUser.user_metadata?.avatar_url || 
                       authUser.user_metadata?.picture ||
                       `https://placehold.co/100x100/A78BFA/FFFFFF?text=${userName.charAt(0)}`;

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        id: authUser.id, // Use the same ID from Supabase Auth
        email: authUser.email!,
        name: userName,
        password: '', // Not needed for OAuth users
        role: role || 'fan', // Default to fan if not specified
        avatar: userAvatar,
        bio: '',
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: '',
      role: newUser.role as 'fan' | 'creator',
      avatar: newUser.avatar,
      bio: newUser.bio,
      followedClubs: [],
      managedClubs: [],
    };
  },
};