
import React from 'react';
import type { Merch } from '../../types';

interface MerchCardProps {
    item: Merch;
}

const MerchCard: React.FC<MerchCardProps> = ({ item }) => (
    <div className="border-4">
        <img src={item.image} alt={item.name} className="w-full h-56 object-cover border-b-4" />
        <div className="p-4">
            <h4 className="font-bold text-2xl">{item.name}</h4>
            <p className="mb-3">${item.price}</p>
            <button className="w-full px-4 py-2 font-semibold">Add to Cart</button>
        </div>
    </div>
);

export default MerchCard;
