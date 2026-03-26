
import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Club, PageContext } from '../../types';

interface CreateClubPageProps {
    onCreateClub: (newClubData: Omit<Club, 'id' | 'creatorId' | 'players' | 'funding' | 'merch' | 'posts'>) => void;
    navigateTo: (page: string, context?: PageContext) => void;
    showAlert: (title: string, message: string) => void;
}

const CreateClubPage: React.FC<CreateClubPageProps> = ({ onCreateClub, navigateTo, showAlert }) => {
    const [name, setName] = useState('');
    const [sport, setSport] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setLogo(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !sport || !tagline || !description || !logo) {
            showAlert("HOLD ON!", "Please fill all fields and upload a logo.");
            return;
        }
        onCreateClub({ name, sport, tagline, description, logo });
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl">Set Up Your New Club</h2>
                <button onClick={() => navigateTo('creatorDashboard')} className="bg-transparent border-none p-0"><ArrowLeft size={24} /></button>
            </div>
            <p>Fill out the details below to get your club's page up and running.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Club Logo</label>
                    <div onClick={handleLogoClick} className="cursor-pointer mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed">
                        <div className="space-y-1 text-center">
                            {logo ? <img src={logo} alt="Logo Preview" className="mx-auto h-24 w-24" /> : <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            <p className="text-sm text-blue-500 hover:underline">Click to upload an image</p>
                            <p className="text-xs">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg" />
                </div>
                <div><label className="block font-medium mb-1">Club Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
                <div><label className="block font-medium mb-1">Sport</label><input type="text" value={sport} onChange={e => setSport(e.target.value)} required /></div>
                <div><label className="block font-medium mb-1">Tagline</label><input type="text" value={tagline} onChange={e => setTagline(e.target.value)} required /></div>
                <div><label className="block font-medium mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3}></textarea></div>
                <button type="submit" className="w-full bg-green-500 py-3 text-lg font-semibold">Create Club Page</button>
            </form>
        </div>
    );
};

export default CreateClubPage;
