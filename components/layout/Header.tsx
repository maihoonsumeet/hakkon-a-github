import React from 'react';
import { Shield, UserCircle, LogOut } from 'lucide-react';
import type { PageContext, User } from '../../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    navigateTo: (page: string, context?: PageContext) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, navigateTo }) => {
    const goHome = () => navigateTo(user.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');
    return (
        <header>
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={goHome}>
                    <Shield size={32} />
                    <span className="text-2xl">HaKKon-A</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="hidden sm:block text-lg">HEY, {user.name}!</span>
                    {user.role === 'fan' && <button onClick={() => navigateTo('fanProfile')} className="p-2 bg-transparent border-none"><UserCircle /></button>}
                    <button onClick={onLogout} title="Logout" className="bg-red-500 p-2"><LogOut size={20} /></button>
                </div>
            </nav>
        </header>
    );
};

export default Header;