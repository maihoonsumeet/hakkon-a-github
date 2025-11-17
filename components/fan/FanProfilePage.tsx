
import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import type { User } from '../../types';

interface FanProfilePageProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

const FanProfilePage: React.FC<FanProfilePageProps> = ({ user, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio);
    const [avatar, setAvatar] = useState(user.avatar);

    const handleSave = () => {
        onUpdateUser({ ...user, name, bio, avatar });
        setIsEditing(false);
    }

    const handleAvatarChange = () => {
        const newAvatar = `https://placehold.co/150x150/A78BFA/FFFFFF?text=${name.charAt(0)}`;
        setAvatar(newAvatar);
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl">Your Profile</h2>
                <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit Profile'}</button>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <img src={avatar} alt="Profile" className="w-36 h-36 border-4 border-black" />
                    {isEditing && (<button onClick={handleAvatarChange} className="absolute bottom-1 right-1 bg-blue-500 p-2"><Camera size={18} /></button>)}
                </div>
                {!isEditing ? (
                    <>
                        <h1 className="text-5xl">{name}</h1>
                        <p className="text-center max-w-md">{bio || "You haven't written a bio yet."}</p>
                    </>
                ) : (
                    <div className="w-full space-y-4 pt-4">
                        <div><label className="block font-medium mb-1">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2" /></div>
                        <div><label className="block font-medium mb-1">Bio</label><textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full p-2"></textarea></div>
                        <button onClick={handleSave} className="w-full bg-green-500 py-2">Save Changes</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FanProfilePage;
