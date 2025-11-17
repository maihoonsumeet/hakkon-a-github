
import React from 'react';
import { Plus } from 'lucide-react';
import type { Club, PageContext, User } from '../../types';

interface CreatorDashboardProps {
    currentUser: User;
    clubs: Club[];
    navigateTo: (page: string, context?: PageContext) => void;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ currentUser, clubs, navigateTo }) => {
    const managedClubs = clubs.filter(club => currentUser.managedClubs.includes(club.id));
    return (
        <div className="space-y-8">
            <h1 className="text-5xl">Creator Dashboard</h1>
            <div className="bg-white p-6">
                <h2 className="text-4xl mb-4">Your Clubs</h2>
                <div className="space-y-4">
                    {managedClubs.length > 0 ? managedClubs.map(club => (
                        <div key={club.id} className="flex items-center justify-between p-4 bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <img src={club.logo} alt={club.name} className="w-12 h-12" />
                                <div>
                                    <p className="font-bold text-lg">{club.name}</p>
                                    <p className="text-sm">{club.players.length} Players · {club.merch.length} Merch</p>
                                </div>
                            </div>
                            <button onClick={() => navigateTo('clubManagement', { clubId: club.id })} className="px-6 py-2">Manage</button>
                        </div>
                    )) : <p className="text-center py-4">You haven't created any clubs yet.</p>}
                </div>
                <button onClick={() => navigateTo('createClub')} className="mt-6 w-full flex items-center justify-center space-x-2 bg-green-500 py-3">
                    <Plus size={20} />
                    <span>Create a New Club</span>
                </button>
            </div>
        </div>
    );
};

export default CreatorDashboard;
