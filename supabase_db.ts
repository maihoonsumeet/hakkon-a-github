import { api } from './lib/api';
import type { Club, User } from './types';

// Cache for frequently accessed data
let clubsCache: Club[] | null = null;
let usersCache: { [email: string]: User } | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5000; // 5 seconds

const subscribers: (() => void)[] = [];

const notify = () => {
  subscribers.forEach(callback => callback());
};

const shouldRefresh = () => {
  return Date.now() - lastFetch > CACHE_DURATION;
};

export const database = {
  /**
   * Subscribe to data changes.
   */
  subscribe(callback: () => void) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) subscribers.splice(index, 1);
    };
  },

  /**
   * Get the current state of the database.
   */
  async getState() {
    if (!clubsCache || !usersCache || shouldRefresh()) {
      const [clubs, users] = await Promise.all([
        api.getAllClubs(),
        api.getAllUsers(),
      ]);

      clubsCache = clubs;
      usersCache = users.reduce((acc, user) => {
        acc[user.email] = user;
        return acc;
      }, {} as { [email: string]: User });

      lastFetch = Date.now();
    }

    return { clubs: clubsCache, users: usersCache };
  },

  /**
   * Force refresh data from server
   */
  async refresh() {
    clubsCache = null;
    usersCache = null;
    const state = await this.getState();
    notify();
    return state;
  },

  // --- Data Access & Mutation Methods ---

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await api.findUserByEmail(email);
    return user || undefined;
  },

  async addUser(newUser: Omit<User, 'id'>) {
    await api.createUser(newUser);
    await this.refresh();
  },

  async updateUser(updatedUser: User) {
    await api.updateUser(updatedUser);
    if (usersCache && usersCache[updatedUser.email]) {
      usersCache[updatedUser.email] = updatedUser;
    }
    notify();
  },

  async addClub(newClub: Omit<Club, 'id' | 'players' | 'funding' | 'merch' | 'posts'>) {
    await api.createClub(newClub);
    await this.refresh();
  },

  async updateClub(updatedClub: Club) {
    await api.updateClub(updatedClub);
    if (clubsCache) {
      clubsCache = clubsCache.map(c => (c.id === updatedClub.id ? updatedClub : c));
    }
    notify();
  },

  async addPost(clubId: number, newPostData: { text: string; image: string | null }) {
    await api.createPost(clubId, newPostData);
    await this.refresh();
  },

  async deletePost(clubId: number, postId: number) {
    await api.deletePost(clubId, postId);
    if (clubsCache) {
      clubsCache = clubsCache.map(club => {
        if (club.id === clubId) {
          return { ...club, posts: club.posts.filter(post => post.id !== postId) };
        }
        return club;
      });
    }
    notify();
  },

  async addComment(clubId: number, postId: number, commentText: string, currentUser: User) {
    await api.createComment(postId, currentUser.id, commentText);
    await this.refresh();
  },

  async deleteComment(clubId: number, postId: number, commentId: number) {
    await api.deleteComment(postId, commentId);
    if (clubsCache) {
      clubsCache = clubsCache.map(club => {
        if (club.id === clubId) {
          const updatedPosts = club.posts.map(post => {
            if (post.id === postId) {
              return { ...post, comments: post.comments.filter(c => c.id !== commentId) };
            }
            return post;
          });
          return { ...club, posts: updatedPosts };
        }
        return club;
      });
    }
    notify();
  },

  async addPlayer(clubId: number, newPlayerData: { name: string; position: string; avatar: string }) {
    await api.createPlayer(clubId, newPlayerData);
    await this.refresh();
  },

  async toggleFollow(userId: string, clubId: number, isFollowing: boolean) {
    await api.toggleFollow(userId, clubId, isFollowing);
    // Update cache optimistically
    if (usersCache) {
      Object.values(usersCache).forEach(user => {
        if (user.id === userId) {
          if (isFollowing) {
            user.followedClubs = user.followedClubs.filter(id => id !== clubId);
          } else {
            user.followedClubs.push(clubId);
          }
        }
      });
    }
    notify();
  },
};