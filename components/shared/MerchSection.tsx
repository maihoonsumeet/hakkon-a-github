
import React from 'react';
import type { Merch } from '../../types';
import MerchCard from './MerchCard';

interface MerchSectionProps {
    merch: Merch[];
}

const MerchSection: React.FC<MerchSectionProps> = ({ merch }) => (
    <div className="bg-white p-8">
        <h3 className="text-4xl mb-6">Official Merchandise</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merch.map(item => <MerchCard key={item.id} item={item} />)}
        </div>
    </div>
);

export default MerchSection;
