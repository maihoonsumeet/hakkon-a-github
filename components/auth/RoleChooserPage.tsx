
import React from 'react';
import { Shield, Users, Edit } from 'lucide-react';
import type { User } from '../../types';

interface RoleChooserPageProps {
    onCompleteSignUp: (role: User['role']) => void;
}

const RoleChooserPage: React.FC<RoleChooserPageProps> = ({ onCompleteSignUp }) => (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
        <div className="text-center mb-12">
            <Shield className="mx-auto" size={64} />
            <h1 className="text-6xl mt-4">One Last Step!</h1>
            <p className="text-lg max-w-2xl mx-auto mt-2">ARE YOU A FAN OR A CREATOR?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div onClick={() => onCompleteSignUp('fan')} className="bg-white p-10 cursor-pointer text-center">
                <Users className="mx-auto" size={48} />
                <h2 className="text-4xl mt-4">I'm a Fan</h2>
                <p className="mt-2">Follow your favorite clubs, get updates, and support your teams.</p>
            </div>
            <div onClick={() => onCompleteSignUp('creator')} className="bg-white p-10 cursor-pointer text-center">
                <Edit className="mx-auto" size={48} />
                <h2 className="text-4xl mt-4">I'm a Creator</h2>
                <p className="mt-2">Create and manage your club's page, post updates, and engage with fans.</p>
            </div>
        </div>
    </div>
);

export default RoleChooserPage;
