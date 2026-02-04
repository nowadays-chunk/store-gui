import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function CustomerLayout({ children }) {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-900 selection:bg-black selection:text-white">
            <Navbar />
            <main className="flex-grow pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={router.route}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}
