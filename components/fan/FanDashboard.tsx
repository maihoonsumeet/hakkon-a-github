
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PostCard from '../shared/PostCard';
import type { Club, PageContext, User } from '../../types';

interface FanDashboardProps {
    currentUser: User;
    clubs: Club[];
    navigateTo: (page: string, context?: PageContext) => void;
    users: User[];
    onAddComment: (clubId: number, postId: number, commentText: string) => void;
    onDeletePost: (clubId: number, postId: number) => void;
    onDeleteComment: (clubId: number, postId: number, commentId: number) => void;
}

const FanDashboard: React.FC<FanDashboardProps> = ({ currentUser, clubs, navigateTo, users, onAddComment, onDeletePost, onDeleteComment }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const followedClubsPosts = clubs.filter(club => currentUser.followedClubs.includes(club.id)).flatMap(club => club.posts.map(post => ({ ...post, club }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const filteredClubs = clubs.filter(club => club.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-5xl">Fan Dashboard</h1>
                <div className="relative md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} />
                    <input type="text" placeholder="Search for any club..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2" />
                </div>
            </div>
            {searchTerm ? (
                <div className="bg-white p-6">
                    <h2 className="text-4xl mb-4">Search Results</h2>
                    <div className="space-y-4">
                        {filteredClubs.length > 0 ? filteredClubs.map(club => (
                            <div key={club.id} onClick={() => navigateTo('clubPublicView', { clubId: club.id })} className="flex items-center space-x-4 p-3 bg-gray-50 cursor-pointer">
                                <img src={club.logo} alt={club.name} className="w-12 h-12" />
                                <div><p className="font-bold text-lg">{club.name}</p><p className="text-sm">{club.sport}</p></div>
                            </div>
                        )) : <p>No clubs found.</p>}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-4xl">Your Feed</h2>
                        {followedClubsPosts.length > 0 ? (
                            followedClubsPosts.map(post => <PostCard key={`${post.club.id}-${post.id}`} post={post} club={post.club} navigateTo={navigateTo} users={users} onAddComment={onAddComment} currentUser={currentUser} onDeletePost={onDeletePost} onDeleteComment={onDeleteComment} />)
                        ) : (
                            <div className="bg-white p-8 text-center">
                                <h2 className="text-3xl">Your feed is empty!</h2>
                                <p className="mt-2">Follow clubs to see their updates.</p>
                            </div>
                        )}
                    </div>
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6">
                            <h2 className="text-4xl mb-4">Discover Clubs</h2>
                            <div className="space-y-4">
                                {clubs.filter(c => !currentUser.followedClubs.includes(c.id)).map(club => (
                                    <div key={club.id} onClick={() => navigateTo('clubPublicView', { clubId: club.id })} className="flex items-center space-x-4 p-3 bg-gray-50 cursor-pointer">
                                        <img src={club.logo} alt={club.name} className="w-12 h-12" />
                                        <div><p className="font-bold text-lg">{club.name}</p><p className="text-sm">{club.sport}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default FanDashboard;
