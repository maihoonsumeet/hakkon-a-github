
import React, { useState } from 'react';
import { Newspaper, Users, Shirt, DollarSign, Settings } from 'lucide-react';
import type { Club, Funding } from '../../types';
import { database } from '../../db';
import PostsManager from './PostsManager';
import PlayerRoster from '../shared/PlayerRoster';
import MerchManager from './MerchManager';
import FundingSection from '../shared/FundingSection';
import ClubSettings from './ClubSettings';

interface ClubManagementPageProps {
    club: Club;
    onAddPost: (clubId: number, newPost: { text: string; image: string | null; }) => void;
    onAddPlayer: (clubId: number, newPlayer: { name: string, position: string, avatar: string }) => void;
    onUpdateClub: (updatedClub: Club) => void;
    onDeletePost: (clubId: number, postId: number) => void;
}

const ClubManagementPage: React.FC<ClubManagementPageProps> = ({ club, onAddPost, onAddPlayer, onUpdateClub, onDeletePost }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const tabs = [
        { id: 'posts', label: 'Posts', icon: Newspaper },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'merch', label: 'Merch', icon: Shirt },
        { id: 'funding', label: 'Funding', icon: DollarSign },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const handleUpdateFunding = (newFunding: Funding) => {
        database.updateClubFunding(club.id, newFunding);
        alert("ZAP! Funding settings updated.");
    };

    return (
        <div className="space-y-8">
            <header className="bg-white p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <img src={club.logo} alt={club.name} className="w-32 h-32 object-cover" />
                    <div>
                        <h1 className="text-6xl">{club.name}</h1>
                        <p className="text-xl mt-1">Club Management</p>
                    </div>
                </div>
            </header>

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
                    {activeTab === 'posts' && <PostsManager club={club} onAddPost={onAddPost} onDeletePost={onDeletePost} />}
                    {activeTab === 'team' && <PlayerRoster club={club} onAddPlayer={onAddPlayer} />}
                    {activeTab === 'merch' && <MerchManager />}
                    {activeTab === 'funding' && <FundingSection funding={club.funding} isReadOnly={false} onUpdateFunding={handleUpdateFunding} />}
                    {activeTab === 'settings' && <ClubSettings club={club} onUpdateClub={onUpdateClub} />}
                </div>
            </div>
        </div>
    );
};

export default ClubManagementPage;
