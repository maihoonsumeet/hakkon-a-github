
import React, { useState, useRef } from 'react';
import type { Club } from '../../types';

interface ClubSettingsProps {
    club: Club;
    onUpdateClub: (updatedClub: Club) => void;
}

const ClubSettings: React.FC<ClubSettingsProps> = ({ club, onUpdateClub }) => {
    const [name, setName] = useState(club.name);
    const [tagline, setTagline] = useState(club.tagline);
    const [description, setDescription] = useState(club.description);
    const [logo, setLogo] = useState(club.logo);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => { onUpdateClub({ ...club, name, tagline, description, logo }); }
    const handleLogoClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setLogo(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white p-8">
            <h3 className="text-4xl mb-4">Club Settings</h3>
            <div className="space-y-4">
                <p>Manage your club's identity and information here.</p>
                <div>
                    <label className="block font-medium mb-1">Club Logo</label>
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="logo" className="w-20 h-20" />
                        <button onClick={handleLogoClick} className="py-1 px-3 text-sm">Change</button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                </div>
                <div><label className="block font-medium mb-1">Club Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
                <div><label className="block font-medium mb-1">Tagline</label><input type="text" value={tagline} onChange={e => setTagline(e.target.value)} /></div>
                <div><label className="block font-medium mb-1">Description</label><textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}></textarea></div>
                <button onClick={handleSave} className="bg-green-500 py-2 px-4">Save Settings</button>
            </div>
        </div>
    );
}

export default ClubSettings;
