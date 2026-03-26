
import React, { useState, useRef } from 'react';
import { UserCircle } from 'lucide-react';

interface AddPlayerFormProps {
    clubId: number;
    onAddPlayer: (clubId: number, newPlayer: { name: string; position: string; avatar: string; }) => void;
    onDone: () => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ clubId, onAddPlayer, onDone }) => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [avatar, setAvatar] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setAvatar(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !position) return;
        onAddPlayer(clubId, { name, position, avatar: avatar || `https://placehold.co/100x100/A78BFA/FFFFFF?text=${name.charAt(0)}` });
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 mb-8 border-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Player Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2" required /></div>
                <div><label className="block text-sm font-medium mb-1">Position</label><input type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full mt-1 p-2" required /></div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Player Photo</label>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center border-2">
                        {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <UserCircle size={32} />}
                    </div>
                    <button type="button" onClick={handleAvatarClick} className="text-sm py-1 px-3">Upload Photo</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
            </div>
            <button type="submit" className="w-full bg-green-500 py-2 px-4 font-semibold">Add to Roster</button>
        </form>
    );
};

export default AddPlayerForm;
