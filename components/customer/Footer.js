import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="font-display font-bold text-2xl uppercase tracking-wider mb-4">Parfumerie Jaouad</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            L'essence du luxe et de l'élégance marocaine. Découvrez notre collection exclusive de parfums authentiques.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Navigation</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">Nos Parfums</Link></li>
                            <li><Link href="/#collections" className="hover:text-white transition-colors">Collections</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Légal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Conditions Générales</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Livraison & Retours</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div>
                        <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6">Restez informés</h4>
                        <div className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Votre email"
                                className="bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-white transition-colors text-sm"
                            />
                            <button className="text-xs uppercase tracking-widest text-left hover:text-accent transition-colors">S'inscrire</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 uppercase tracking-wider">
                    <p>&copy; {new Date().getFullYear()} Parfumerie Jaouad. Tous droits réservés.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <span>Facebook</span>
                        <span>Instagram</span>
                        <span>Twitter</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
