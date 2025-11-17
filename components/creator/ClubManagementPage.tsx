
import React, { useState } from 'react';
import { Newspaper, Users, Shirt, DollarSign, Settings } from 'lucide-react';
import type { Club } from '../../types';
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
    return (
        <div className="space-y-8">
            <header className="bg-white p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <img src={club.logo} alt={club.name} className="w-32 h-32" />
                    <div>
                        <h1 className="text-6xl">{club.name}</h1>
                        <p className="text-xl mt-1">Club Management</p>
                    </div>
                </div>
            </header>
            <div>
                <div className="border-b-4">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-black text-black' : 'border-transparent'} whitespace-nowrap py-4 px-1 border-b-4 font-medium text-lg flex items-center space-x-2 bg-transparent`}>
                                <tab.icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-8">
                    {activeTab === 'posts' && <PostsManager club={club} onAddPost={onAddPost} onDeletePost={onDeletePost} />}
                    {activeTab === 'team' && <PlayerRoster club={club} onAddPlayer={onAddPlayer} />}
                    {activeTab === 'merch' && <MerchManager />}
                    {activeTab === 'funding' && <FundingSection funding={club.funding} isReadOnly={false} />}
                    {activeTab === 'settings' && <ClubSettings club={club} onUpdateClub={onUpdateClub} />}
                </div>
            </div>
        </div>
    );
};

export default ClubManagementPage;
