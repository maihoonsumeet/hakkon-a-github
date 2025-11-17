import { supabase } from './supabase';
import type { Club, User, Post, Comment, Player } from '../types';

// Helper to transform database club to app Club type
const transformClub = async (dbClub: any): Promise<Club> => {
  const [posts, players, merch] = await Promise.all([
    supabase
      .from('posts')
      .select('*, comments(*)')
      .eq('club_id', dbClub.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('players')
      .select('*')
      .eq('club_id', dbClub.id),
    supabase
      .from('merch')
      .select('*')
      .eq('club_id', dbClub.id),
  ]);

  const transformedPosts = await Promise.all(
    (posts.data || []).map(async (post) => {
      const comments = await Promise.all(
        (post.comments || []).map(async (comment: any) => ({
          id: comment.id,
          userId: comment.user_id,
          text: comment.text,
        }))
      );

      return {
        id: post.id,
        text: post.text,
        image: post.image,
        timestamp: new Date(post.created_at),
        likes: post.likes,
        comments,
      };
    })
  );

  return {
    id: dbClub.id,
    name: dbClub.name,
    sport: dbClub.sport,
    logo: dbClub.logo,
    tagline: dbClub.tagline,
    description: dbClub.description,
    creatorId: dbClub.creator_id,
    funding: {
      current: dbClub.funding_current,
      goal: dbClub.funding_goal,
    },
    players: (players.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      number: p.number,
      avatar: p.avatar,
    })),
    merch: (merch.data || []).map((m) => ({
      id: m.id,
      name: m.name,
      price: m.price,
      image: m.image,
    })),
    posts: transformedPosts,
  };
};

export const api = {
  // Users
  async findUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;

    const { data: followedClubs } = await supabase
      .from('user_club_follows')
      .select('club_id')
      .eq('user_id', data.id);

    const { data: managedClubs } = await supabase
      .from('clubs')
      .select('id')
      .eq('creator_id', data.id);

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as 'fan' | 'creator',
      avatar: data.avatar,
      bio: data.bio,
      followedClubs: (followedClubs || []).map((f) => f.club_id),
      managedClubs: (managedClubs || []).map((c) => c.id),
    };
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        password: user.password || '',
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...user,
      id: data.id,
      followedClubs: [],
      managedClubs: [],
    };
  },

  async updateUser(user: User): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      })
      .eq('id', user.id);

    if (error) throw error;

    // Update follows
    await supabase
      .from('user_club_follows')
      .delete()
      .eq('user_id', user.id);

    if (user.followedClubs.length > 0) {
      await supabase.from('user_club_follows').insert(
        user.followedClubs.map((clubId) => ({
          user_id: user.id,
          club_id: clubId,
        }))
      );
    }
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');

    if (error) throw error;

    return Promise.all(
      data.map(async (user) => {
        const { data: followedClubs } = await supabase
          .from('user_club_follows')
          .select('club_id')
          .eq('user_id', user.id);

        const { data: managedClubs } = await supabase
          .from('clubs')
          .select('id')
          .eq('creator_id', user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role as 'fan' | 'creator',
          avatar: user.avatar,
          bio: user.bio,
          followedClubs: (followedClubs || []).map((f) => f.club_id),
          managedClubs: (managedClubs || []).map((c) => c.id),
        };
      })
    );
  },

  // Clubs
  async getAllClubs(): Promise<Club[]> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Promise.all(data.map(transformClub));
  },

  async getClubById(id: number): Promise<Club | null> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return transformClub(data);
  },

  async createClub(
    club: Omit<Club, 'id' | 'players' | 'funding' | 'merch' | 'posts'>
  ): Promise<Club> {
    const { data, error } = await supabase
      .from('clubs')
      .insert({
        name: club.name,
        sport: club.sport,
        logo: club.logo,
        tagline: club.tagline,
        description: club.description,
        creator_id: club.creatorId,
      })
      .select()
      .single();

    if (error) throw error;

    return transformClub(data);
  },

  async updateClub(club: Club): Promise<void> {
    const { error } = await supabase
      .from('clubs')
      .update({
        name: club.name,
        sport: club.sport,
        logo: club.logo,
        tagline: club.tagline,
        description: club.description,
        funding_current: club.funding.current,
        funding_goal: club.funding.goal,
      })
      .eq('id', club.id);

    if (error) throw error;
  },

  // Posts
  async createPost(
    clubId: number,
    post: { text: string; image: string | null }
  ): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        club_id: clubId,
        text: post.text,
        image: post.image,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      text: data.text,
      image: data.image,
      timestamp: new Date(data.created_at),
      likes: data.likes,
      comments: [],
    };
  },

  async deletePost(clubId: number, postId: number): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('club_id', clubId);

    if (error) throw error;
  },

  // Comments
  async createComment(
    postId: number,
    userId: string,
    text: string
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        text,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      text: data.text,
    };
  },

  async deleteComment(postId: number, commentId: number): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('post_id', postId);

    if (error) throw error;
  },

  // Players
  async createPlayer(
    clubId: number,
    player: { name: string; position: string; avatar: string }
  ): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert({
        club_id: clubId,
        name: player.name,
        position: player.position,
        avatar: player.avatar,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      position: data.position,
      number: data.number,
      avatar: data.avatar,
    };
  },

  // Follow/Unfollow
  async toggleFollow(userId: string, clubId: number, isFollowing: boolean): Promise<void> {
    if (isFollowing) {
      const { error } = await supabase
        .from('user_club_follows')
        .delete()
        .eq('user_id', userId)
        .eq('club_id', clubId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('user_club_follows')
        .insert({ user_id: userId, club_id: clubId });

      if (error) throw error;
    }
  },
};