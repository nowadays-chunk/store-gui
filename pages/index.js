import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../utils/api";
import ProductCard from "../components/customer/ProductCard";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col md:flex-row">
        {/* Left Side (Image 1) */}
        <div
          className="w-full md:w-[40%] h-1/2 md:h-full bg-cover bg-center relative"
          style={{ backgroundImage: "url('/assets/backgrounds/homme-parfum-jaouad.png')" }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Right Side (Image 2) */}
        <div
          className="w-full md:w-[60%] h-1/2 md:h-full bg-cover bg-center relative"
          style={{ backgroundImage: "url('/assets/backgrounds/femme-parfum-chez-jaouad.png')" }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 uppercase">
              Parfumerie <span className="text-white/90">Jaouad</span>
            </h1>
            <p className="font-sans text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto mb-10 text-white/90">
              L’élégance orientale, une signature inoubliable. Découvrez l'art du parfum raffiné.
            </p>
            <Link
              href="#products"
              className="inline-block px-10 py-4 border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
            >
              Découvrir la Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video w-full overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/YrGyIA9EJR?si=5XabOI-L9pMrGcaE"
              title="Nature inspiration"
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section id="products" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight mb-4">Nos Créations</h2>
            <div className="h-1 w-20 bg-black mx-auto mb-6" />
            <p className="text-gray-500 max-w-2xl mx-auto">
              Une sélection de fragrances uniques, élaborées avec les ingrédients les plus nobles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            {loading ? (
              <p className="col-span-full text-center py-20">Chargement de la collection...</p>
            ) : products.length > 0 ? (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-xl">Notre collection est en cours de mise à jour.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION (To Contact) */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold uppercase mb-6">Besoin d'un conseil personnalisé ?</h2>
          <p className="text-gray-600 mb-8">Nos experts sont à votre disposition pour vous guider dans le choix de votre signature olfactive.</p>
          <Link href="/contact" className="inline-block bg-black text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-accent transition-colors">
            Contactez-nous
          </Link>
        </div>
      </section>
    </div>
  );
}
