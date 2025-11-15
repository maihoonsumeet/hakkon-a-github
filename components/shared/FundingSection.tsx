
import React from 'react';
import type { Funding } from '../../types';

interface FundingSectionProps {
    funding: Funding;
    isReadOnly?: boolean;
}

const FundingSection: React.FC<FundingSectionProps> = ({ funding, isReadOnly = true }) => {
    const percentage = (funding.current / funding.goal) * 100;
    return (
        <div className="bg-white p-8">
            <h3 className="text-4xl mb-2">Team Funding Goal</h3>
            <p className="mb-6">Raising funds for new equipment!</p>
            <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-sm font-medium">
                    <span>${funding.current.toLocaleString()} Raised</span>
                    <span>${funding.goal.toLocaleString()} Goal</span>
                </div>
                <button className="w-full bg-green-500 px-6 py-3 font-semibold text-lg">{isReadOnly ? 'Support Team' : 'Manage Funding'}</button>
            </div>
        </div>
    );
};

export default FundingSection;
