
import React, { useState } from 'react';
import { DollarSign, Calendar, Target, X, Heart } from 'lucide-react';
import type { Funding } from '../../types';

interface FundingSectionProps {
    funding: Funding;
    isReadOnly?: boolean;
    onDonate?: (amount: number) => void;
    onUpdateFunding?: (newFunding: Funding) => void;
}

const FundingSection: React.FC<FundingSectionProps> = ({ funding, isReadOnly = true, onDonate, onUpdateFunding }) => {
    // Calculate percentage, capped at 100 for visual bar, but we can go over.
    const percentage = Math.min((funding.current / funding.goal) * 100, 100);
    
    // State for Fan Donation Modal
    const [isDonateOpen, setIsDonateOpen] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    
    // State for Creator Edit Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Funding>(funding);

    const handleDonateClick = (amount: number) => {
        if (onDonate) {
            onDonate(amount);
            setIsDonateOpen(false);
        }
    };

    const handleCustomDonate = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(customAmount);
        if (amount > 0) handleDonateClick(amount);
    };

    const handleEditSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (onUpdateFunding) {
            onUpdateFunding({
                ...editForm,
                current: funding.current, // Preserve current amount
                goal: parseFloat(editForm.goal.toString())
            });
            setIsEditing(false);
        }
    };

    if (isEditing && !isReadOnly) {
        return (
            <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-4xl">Manage Campaign</h3>
                    <button onClick={() => setIsEditing(false)}><X size={24} /></button>
                </div>
                <form onSubmit={handleEditSave} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">Campaign Title</label>
                        <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full p-2 border-2 border-black" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Why are you raising money?</label>
                        <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-2 border-2 border-black" rows={3} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold mb-1">Goal Amount ($)</label>
                            <input type="number" value={editForm.goal} onChange={e => setEditForm({...editForm, goal: parseFloat(e.target.value)})} className="w-full p-2 border-2 border-black" required min="1" />
                        </div>
                        <div>
                            <label className="block font-bold mb-1">Deadline</label>
                            <input type="date" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} className="w-full p-2 border-2 border-black" required />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-green-500 py-3 font-bold text-lg hover:bg-black hover:text-white transition-colors border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">SAVE SETTINGS</button>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 relative">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-4xl">{funding.title || "Team Funding Goal"}</h3>
                <div className="bg-yellow-300 px-3 py-1 font-bold border-2 border-black text-sm transform rotate-2">
                    ENDS: {funding.deadline ? new Date(funding.deadline).toLocaleDateString() : 'N/A'}
                </div>
            </div>
            
            <p className="mb-6 text-lg">{funding.description || "Raising funds for the team!"}</p>
            
            <div className="space-y-6">
                {/* Progress Bar */}
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between font-bold">
                        <span className="text-xs inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 border-2 border-black">
                            Progress
                        </span>
                        <div className="text-right">
                            <span className="text-lg inline-block text-black">
                                {Math.round(percentage)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-gray-200 border-2 border-black">
                        <div style={{ width: `${percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 border-r-2 border-black"></div>
                    </div>
                </div>

                <div className="flex justify-between items-end border-b-4 pb-4 border-dashed border-gray-300">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 font-bold uppercase">Raised</p>
                        <p className="text-3xl font-bangers text-green-600">${funding.current.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500 font-bold uppercase">Goal</p>
                        <p className="text-3xl font-bangers">${funding.goal.toLocaleString()}</p>
                    </div>
                </div>

                {!isReadOnly ? (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-full bg-blue-500 py-3 font-bold text-lg border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        MANAGE FUNDING
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsDonateOpen(true)} 
                        className="w-full bg-green-500 py-3 font-bold text-lg flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        <Heart fill="black" size={20} /> SUPPORT THE TEAM
                    </button>
                )}
            </div>

            {/* Donation Modal Overlay */}
            {isDonateOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 max-w-md w-full border-4 border-black shadow-[12px_12px_0px_#FFF] relative animate-bounce-in">
                        <button onClick={() => setIsDonateOpen(false)} className="absolute top-4 right-4 hover:scale-110"><X size={32} /></button>
                        
                        <div className="text-center mb-6">
                            <h2 className="text-5xl font-bangers text-green-600 mb-2">KAPOW!</h2>
                            <p className="font-bold text-xl">Make a Donation</p>
                            <p className="text-sm mt-2">Your support helps {funding.title} happen!</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[10, 25, 50].map(amt => (
                                <button 
                                    key={amt}
                                    onClick={() => handleDonateClick(amt)}
                                    className="py-4 text-xl font-bold bg-yellow-300 border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t-2 border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-sm text-gray-500 font-bold">OR CUSTOM AMOUNT</span>
                            </div>
                        </div>

                        <form onSubmit={handleCustomDonate} className="mt-6 flex gap-2">
                            <div className="relative flex-grow">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold">$</span>
                                <input 
                                    type="number" 
                                    value={customAmount} 
                                    onChange={e => setCustomAmount(e.target.value)} 
                                    className="w-full pl-8 pr-4 py-3 border-2 border-black font-bold"
                                    placeholder="0.00"
                                    min="1"
                                />
                            </div>
                            <button type="submit" className="bg-green-500 px-6 font-bold border-2 border-black hover:bg-black hover:text-white">
                                GO!
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FundingSection;