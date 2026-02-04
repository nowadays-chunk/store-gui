import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckIcon from '@mui/icons-material/Check';

export default function AddToCart({ product, className }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`flex items-center justify-center h-14 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-all ${className || ''}`}
        >
            {added ? (
                <span className="flex items-center gap-2">
                    <CheckIcon fontSize="small" /> Ajouté
                </span>
            ) : (
                'Ajouter au panier'
            )}
        </button>
    );
}
