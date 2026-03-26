
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Club } from '../../types';
import AddPlayerForm from '../creator/AddPlayerForm';

interface PlayerRosterProps {
    club: Club;
    onAddPlayer?: (clubId: number, newPlayer: { name: string; position: string; avatar: string; }) => void;
    isReadOnly?: boolean;
}

const PlayerRoster: React.FC<PlayerRosterProps> = ({ club, onAddPlayer, isReadOnly = false }) => {
    const [isAdding, setIsAdding] = useState(false);
    return (
        <div className="bg-white p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-4xl">Team Roster</h3>
                {!isReadOnly && onAddPlayer && (
                    <button onClick={() => setIsAdding(!isAdding)} className="flex items-center space-x-2 px-4 py-2">
                        <UserPlus size={20} />
                        <span>{isAdding ? 'Cancel' : 'Add Player'}</span>
                    </button>
                )}
            </div>
            {isAdding && onAddPlayer && <AddPlayerForm clubId={club.id} onAddPlayer={onAddPlayer} onDone={() => setIsAdding(false)} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {club.players.length > 0 ? club.players.map(player => (
                    <div key={player.id} className="text-center bg-gray-50 p-4">
                        <img src={player.avatar} alt={player.name} className="w-24 h-24 mx-auto mb-3" />
                        <p className="font-bold text-lg">{player.name}</p>
                        <p className="font-semibold">{player.position}</p>
                    </div>
                )) : <p>No players on the roster.</p>}
            </div>
        </div>
    );
};

export default PlayerRoster;
