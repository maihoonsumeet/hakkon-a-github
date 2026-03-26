
import React, { useState } from 'react';
import { Shield, LogOut, Palette } from 'lucide-react';
import type { PageContext, User, Theme } from '../../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    navigateTo: (page: string, context?: PageContext) => void;
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, navigateTo, currentTheme, setTheme }) => {
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const goHome = () => navigateTo(user.role === 'fan' ? 'fanDashboard' : 'creatorDashboard');

    return (
        <header className="relative z-50">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={goHome}>
                    <Shield size={32} />
                    <span className="text-2xl font-bold truncate">HaKKon-A</span>
                </div>
                <div className="flex items-center space-x-3">
                    {/* Theme Selector */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowThemeMenu(!showThemeMenu)} 
                            className="p-2 bg-transparent border-none hover:bg-white/10 rounded-full"
                            title="Change Theme"
                        >
                            <Palette size={20} />
                        </button>
                        
                        {showThemeMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-xl rounded-lg overflow-hidden border border-gray-200 z-50">
                                <button onClick={() => { setTheme('colour'); setShowThemeMenu(false); }} className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${currentTheme === 'colour' ? 'bg-green-100 font-bold' : ''}`}>
                                    Colour
                                </button>
                                <button onClick={() => { setTheme('modern'); setShowThemeMenu(false); }} className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${currentTheme === 'modern' ? 'bg-blue-100 font-bold' : ''}`}>
                                    Modern (Default)
                                </button>
                                <button onClick={() => { setTheme('comic'); setShowThemeMenu(false); }} className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${currentTheme === 'comic' ? 'bg-yellow-100 font-bold' : ''}`}>
                                    Comic Book
                                </button>
                            </div>
                        )}
                    </div>

                    {/* User Avatar - Always visible, replaces text on mobile */}
                    <button 
                        onClick={() => user.role === 'fan' ? navigateTo('fanProfile') : navigateTo('creatorDashboard')} 
                        className="relative group flex-shrink-0"
                        title={user.role === 'fan' ? "Edit Profile" : "Dashboard"}
                    >
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover shadow-sm group-hover:border-blue-400 transition-colors" 
                        />
                    </button>

                    <button onClick={onLogout} title="Logout" className="bg-red-500 p-2 text-white hover:bg-red-600 rounded flex-shrink-0">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>
            {showThemeMenu && <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>}
        </header>
    );
};

export default Header;
