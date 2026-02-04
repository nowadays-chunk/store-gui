import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // Adjust path if needed
import { motion, AnimatePresence } from 'framer-motion';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Badge } from '@mui/material'; // Or use custom Tailwind Badge

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const cartCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Parfums', href: '/products' },
        { name: 'Collections', href: '/#collections' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="z-50 relative">
                    <span className={`font-display font-bold text-2xl tracking-tighter uppercase ${scrolled ? 'text-black' : 'text-black' // Keep black for now as bg might be white often
                        }`}>
                        Parfumerie <span className="text-accent">Jaouad</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className="hidden md:flex gap-6 items-center">
                    <Link href="/cart" className="relative hover:text-accent transition-colors">
                        <Badge badgeContent={cartCount} color="error" invisible={cartCount === 0}>
                            <ShoppingBagOutlinedIcon />
                        </Badge>
                    </Link>

                    {user ? (
                        <div className="relative group">
                            <Link href="/account" className="hover:text-accent transition-colors">
                                <PersonOutlineOutlinedIcon />
                            </Link>
                            {/* Simple Dropdown for User */}
                            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white border border-gray-100 shadow-xl rounded-none p-4 w-48 flex flex-col gap-2">
                                    <div className="text-xs text-gray-400 uppercase mb-2">Bonjour, {user.firstName}</div>
                                    <Link href="/account" className="text-sm hover:text-accent">Mon Compte</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" className="text-sm hover:text-accent font-bold text-red-500">Admin Panel</Link>
                                    )}
                                    <button onClick={logout} className="text-sm text-left hover:text-accent text-red-500 mt-2">Déconnexion</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="hover:text-accent transition-colors">
                            <PersonOutlineOutlinedIcon />
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden z-50 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="font-display text-3xl font-bold uppercase tracking-tight hover:text-accent"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex gap-8 mt-8">
                            <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-xl">
                                <ShoppingBagOutlinedIcon fontSize="large" /> <span>Panier ({cartCount})</span>
                            </Link>
                        </div>
                        {user ? (
                            <div className="flex flex-col items-center gap-4 mt-4">
                                <Link href="/account" onClick={() => setMobileOpen(false)} className="text-lg">Mon Compte</Link>
                                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-red-500">Déconnexion</button>
                            </div>
                        ) : (
                            <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-lg mt-4 border border-black px-8 py-3 uppercase tracking-widest">Connexion</Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
