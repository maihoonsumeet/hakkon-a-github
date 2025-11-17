
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'fan' | 'creator';
  followedClubs: number[];
  managedClubs: number[];
  avatar: string;
  bio: string;
}

export interface Comment {
  id: number;
  userId: string;
  text: string;
}

export interface Post {
  id: number;
  text: string;
  image: string | null;
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

export interface Player {
  id: number;
  name: string;
  position: string;
  number?: number;
  avatar: string;
}

export interface Funding {
  current: number;
  goal: number;
}

export interface Merch {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Club {
  id: number;
  name: string;
  sport: string;
  logo: string;
  tagline: string;
  description: string;
  creatorId: string;
  players: Player[];
  funding: Funding;
  merch: Merch[];
  posts: Post[];
}

export type PageContext = {
  clubId?: number;
  postId?: number;
};
