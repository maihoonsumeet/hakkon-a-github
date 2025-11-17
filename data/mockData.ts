
import type { Club, User } from '../types';

export const initialMockUsers: { [email: string]: User } = {
    // FIX: Add missing 'managedClubs' property to satisfy the User type.
    'fan@example.com': { id: 'fan1', name: 'Alex', email: 'fan@example.com', password: 'password', role: 'fan', followedClubs: [1, 3], managedClubs: [], avatar: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=A', bio: 'Superfan of the Mountain Lions! Never miss a game.' },
    // FIX: Add missing 'followedClubs' property to satisfy the User type.
    'creator@example.com': { id: 'creator1', name: 'Coach Taylor', email: 'creator@example.com', password: 'password', role: 'creator', managedClubs: [1], followedClubs: [], avatar: 'https://placehold.co/100x100/F472B6/FFFFFF?text=C', bio: 'Leading the Lions to victory.' },
};

export const initialMockClubs: Club[] = [
    { 
        id: 1, 
        name: 'Mountain Lions FC', 
        sport: 'Soccer', 
        logo: 'https://placehold.co/150x150/f0abfc/4a044e?text=🦁', 
        tagline: 'Roaring to Victory', 
        description: 'The fiercest soccer club on the mountain.',
        creatorId: 'creator1',
        players: [
            { id: 1, name: 'Leo Messi', position: 'Forward', number: 10, avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=LM' },
            { id: 2, name: 'Jane Doe', position: 'Midfielder', number: 8, avatar: 'https://placehold.co/100x100/10B981/FFFFFF?text=JD' },
        ],
        funding: { current: 7500, goal: 10000 }, 
        merch: [
            { id: 1, name: 'Home Jersey', price: 59.99, image: 'https://placehold.co/300x300/3B82F6/FFFFFF?text=Jersey' },
            { id: 2, name: 'Team Scarf', price: 24.99, image: 'https://placehold.co/300x300/10B981/FFFFFF?text=Scarf' }
        ],
        posts: [
            { id: 1, text: 'Big win last night! 3-1 against the Vipers. Thanks for the amazing support!', image: 'https://placehold.co/600x400/3B82F6/FFFFFF?text=Victory!', timestamp: new Date('2025-07-21T20:00:00'), likes: 125, comments: [{id: 1, userId: 'fan1', text: 'What a game! Incredible performance.'}, {id: 2, userId: 'creator1', text: 'Couldn\'t have done it without you all!'}] },
            { id: 2, text: 'Next practice is tomorrow at 5 PM. Be ready to work hard!', image: null, timestamp: new Date('2025-07-20T11:00:00'), likes: 42, comments: [] }
        ]
    },
    { id: 2, name: 'City Hawks Basketball', sport: 'Basketball', logo: 'https://placehold.co/150x150/fca5a5/7f1d1d?text=🦅', tagline: 'Soaring above the competition.', description: 'Downtown\'s premier basketball team.', creatorId: 'creator2', players: [], funding: { current: 15000, goal: 20000 }, merch: [{ id: 1, name: 'Slam Dunk Hoodie', price: 79.99, image: 'https://placehold.co/300x300/F59E0B/FFFFFF?text=Hoodie' }], posts: [{ id: 3, text: 'Our new merchandise is now available!', image: 'https://placehold.co/600x400/F59E0B/FFFFFF?text=New+Merch', timestamp: new Date('2025-07-21T15:00:00'), likes: 210, comments: [] }] },
    { id: 3, name: 'Valley Vipers', sport: 'Baseball', logo: 'https://placehold.co/150x150/86efac/064e3b?text=🐍', tagline: 'Striking out the competition.', description: 'The heart of baseball in the valley.', creatorId: 'creator3', players: [], funding: { current: 4000, goal: 5000 }, merch: [], posts: [{ id: 4, text: 'Tough loss, but we\'ll bounce back stronger. See you at the next game.', image: null, timestamp: new Date('2025-07-21T18:00:00'), likes: 76, comments: [] }] },
];