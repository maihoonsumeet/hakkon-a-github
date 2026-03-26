
import React, { useState } from 'react';
import { ArrowLeft, Newspaper, Users, DollarSign, Shirt, Check } from 'lucide-react';
import type { Club, PageContext, User } from '../../types';
import { database } from '../../db';
import PostCard from '../shared/PostCard';
import PlayerRoster from '../shared/PlayerRoster';
import FundingSection from '../shared/FundingSection';
import MerchSection from '../shared/MerchSection';

interface ClubPublicViewProps {
    club: Club;
    navigateTo: (page: string, context?: PageContext) => void;
    users: User[];
    onAddComment: (clubId: number, postId: number, commentText: string) => void;
    currentUser: User;
    onToggleFollow: (clubId: number) => void;
    onDeletePost: (clubId: number, postId: number) => void;
    onDeleteComment: (clubId: number, postId: number, commentId: number) => void;
}

const ClubPublicView: React.FC<ClubPublicViewProps> = ({ club, navigateTo, users, onAddComment, currentUser, onToggleFollow, onDeletePost, onDeleteComment }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const isFollowing = currentUser.followedClubs.includes(club.id);
    const tabs = [
        { id: 'posts', label: 'Posts', icon: Newspaper },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'funding', label: 'Funding', icon: DollarSign },
        { id: 'merch', label: 'Merch', icon: Shirt }
    ];

    const handleDonate = (amount: number) => {
        database.donateToClub(club.id, amount);
        alert(`BOOM! You just donated $${amount} to ${club.name}! You're a hero!`);
    };

    return (
        <div className="space-y-8">
            <button onClick={() => navigateTo('fanDashboard')} className="flex items-center space-x-2 text-blue-500 bg-transparent border-none p-0">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
            </button>
            <div className="bg-white p-8">
                <header className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <img src={club.logo} alt={club.name} className="w-32 h-32 object-cover" />
                    <div>
                        <h1 className="text-6xl">{club.name}</h1>
                        <p className="text-xl mt-1">{club.description}</p>
                    </div>
                    <button onClick={() => onToggleFollow(club.id)} className={`mt-4 md:mt-0 md:ml-auto px-6 py-3 font-semibold flex items-center gap-2 ${isFollowing ? 'bg-gray-200' : 'bg-blue-500'}`}>
                        {isFollowing ? <><Check size={20} /> Following</> : 'Follow Club'}
                    </button>
                </header>
            </div>
            
            {/* Reactive Tab Navigation */}
            <div>
                <div className="tab-nav-container sticky top-2 z-10 pb-2">
                    <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)} 
                                className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''} flex items-center space-x-2 whitespace-nowrap py-3 px-6 text-lg font-medium transition-all`}
                            >
                                <tab.icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="mt-4">
                    {activeTab === 'posts' && <div className="space-y-6">{club.posts.map(post => <PostCard key={post.id} post={post} club={club} navigateTo={navigateTo} users={users} onAddComment={onAddComment} currentUser={currentUser} onDeletePost={onDeletePost} onDeleteComment={onDeleteComment} />)}</div>}
                    {activeTab === 'team' && <PlayerRoster club={club} isReadOnly={true} />}
                    {activeTab === 'funding' && <FundingSection funding={club.funding} isReadOnly={true} onDonate={handleDonate} />}
                    {activeTab === 'merch' && <MerchSection merch={club.merch} />}
                </div>
            </div>
        </div>
    );
};

export default ClubPublicView;
