import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : (product.image || '/assets/products/placeholder.jpeg');
    const productName = product.name || product.title;
    const productPrice = product.basePrice || product.price;

    return (
        <Link href={`/product/${product.slug}`} className="group block">
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                <motion.img
                    src={imageUrl}
                    alt={productName}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }} // smooth cubic-bezier
                />
                {/* Overlay Badge */}
                {product.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-black">
                        {product.category.name}
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-between items-start">
                <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight text-gray-900 group-hover:text-accent transition-colors">
                        {productName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.category?.description || 'Eau de Parfum'}</p>
                </div>
                <div className="text-right">
                    <p className="font-display font-bold text-lg">{productPrice} DHS</p>
                </div>
            </div>
        </Link>
    );
}
