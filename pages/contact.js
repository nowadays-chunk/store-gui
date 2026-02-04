import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import api from '../utils/api';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            // Mock API call or real one if endpoint exists
            // await api.post('/contact', formData); 
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Info Section (Left) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-5/12 bg-black text-white p-10 md:p-20 flex flex-col justify-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                    style={{ backgroundImage: "url('/assets/pattern.png')", backgroundSize: 'cover' }}></div>

                <h1 className="font-display text-4xl md:text-5xl font-bold uppercase mb-8 relative z-10">Contactez-nous</h1>
                <p className="text-gray-400 mb-12 leading-relaxed relative z-10">
                    Notre équipe est à votre écoute pour toute question sur nos parfums, nos points de vente ou pour un conseil personnalisé.
                </p>

                <div className="space-y-8 relative z-10">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full"><LocationOnOutlinedIcon /></div>
                        <div>
                            <h3 className="font-bold uppercase tracking-wide text-sm mb-1">Notre Boutique</h3>
                            <p className="text-gray-400 text-sm">123 Avenue Mohammed VI, Marrakech, Maroc</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full"><PhoneOutlinedIcon /></div>
                        <div>
                            <h3 className="font-bold uppercase tracking-wide text-sm mb-1">Téléphone</h3>
                            <p className="text-gray-400 text-sm">+212 5 24 00 00 00</p>
                            <p className="text-gray-500 text-xs mt-1">Lun-Dim: 09:00 - 20:00</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full"><EmailOutlinedIcon /></div>
                        <div>
                            <h3 className="font-bold uppercase tracking-wide text-sm mb-1">Email</h3>
                            <p className="text-gray-400 text-sm">contact@parfumeriejaouad.com</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Form Section (Right) */}
            <div className="w-full md:w-7/12 bg-gray-50 p-10 md:p-20 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-xl mx-auto w-full"
                >
                    <h2 className="font-display text-2xl font-bold uppercase text-black mb-8">Envoyez un message</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 focus:border-black focus:outline-none transition-colors placeholder-transparent"
                                    placeholder="Nom"
                                />
                                <label className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black">
                                    Nom complet
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 focus:border-black focus:outline-none transition-colors placeholder-transparent"
                                    placeholder="Email"
                                />
                                <label className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black">
                                    Email
                                </label>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="peer w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 focus:border-black focus:outline-none transition-colors placeholder-transparent"
                                placeholder="Sujet"
                            />
                            <label className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black">
                                Sujet
                            </label>
                        </div>

                        <div className="relative">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="peer w-full border-b border-gray-300 bg-transparent py-3 text-gray-900 focus:border-black focus:outline-none transition-colors placeholder-transparent resize-none"
                                placeholder="Message"
                            ></textarea>
                            <label className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black">
                                Votre message
                            </label>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="bg-black text-white px-10 py-4 uppercase tracking-widest font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {status === 'sending' ? 'Envoi...' : 'Envoyer le message'}
                            </button>
                        </div>

                        {status === 'success' && (
                            <div className="p-4 bg-green-50 text-green-700 text-sm border border-green-200">
                                Message envoyé avec succès. Nous vous répondrons bientôt.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-700 text-sm border border-red-200">
                                Une erreur est survenue. Veuillez réessayer.
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
