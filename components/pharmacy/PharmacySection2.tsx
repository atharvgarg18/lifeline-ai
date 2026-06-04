"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ChevronRight, BadgePercent, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────
const MEDICINES = [
  {
    id: 1,
    name: "Crocin 650mg Tablet",
    category: "Pain Relief",
    price: 45,
    mrp: 60,
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=160&fit=crop",
    catColor: "text-red-500",
    catBg: "bg-red-50",
    inStock: true,
  },
  {
    id: 2,
    name: "Dolo 650mg Tablet",
    category: "Pain Relief",
    price: 32,
    mrp: 45,
    img: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&h=160&fit=crop",
    catColor: "text-red-500",
    catBg: "bg-red-50",
    inStock: true,
  },
  {
    id: 3,
    name: "Azithral 500mg Tablet",
    category: "Antibiotic",
    price: 120,
    mrp: 160,
    img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=160&fit=crop",
    catColor: "text-blue-600",
    catBg: "bg-blue-50",
    inStock: true,
  },
  {
    id: 4,
    name: "Calciquick D3 Tablet",
    category: "Vitamins",
    price: 210,
    mrp: 250,
    img: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=160&fit=crop",
    catColor: "text-amber-500",
    catBg: "bg-amber-50",
    inStock: true,
  },
  {
    id: 5,
    name: "Cetaphil Gentle Cleanser",
    category: "Skin Care",
    price: 599,
    mrp: 750,
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=160&fit=crop",
    catColor: "text-pink-500",
    catBg: "bg-pink-50",
    inStock: true,
  },
  {
    id: 6,
    name: "Accu-Chek Active Strip",
    category: "Diabetes Care",
    price: 899,
    mrp: 1100,
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=160&fit=crop",
    catColor: "text-violet-600",
    catBg: "bg-violet-50",
    inStock: false,
  },
  {
    id: 7,
    name: "Pantoprazole 40mg",
    category: "Gastro Care",
    price: 88,
    mrp: 120,
    img: "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=200&h=160&fit=crop",
    catColor: "text-emerald-600",
    catBg: "bg-emerald-50",
    inStock: true,
  },
  {
    id: 8,
    name: "Limcee Vitamin C 500mg",
    category: "Vitamins",
    price: 55,
    mrp: 75,
    img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=160&fit=crop",
    catColor: "text-amber-500",
    catBg: "bg-amber-50",
    inStock: true,
  },
];

// ─── Medicine Card ─────────────────────────────────────────────────────────────
function MedicineCard({ med, delay }: { med: (typeof MEDICINES)[0]; delay: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = Math.round(((med.mrp - med.price) / med.mrp) * 100);

  function handleAddToCart() {
    if (added || !med.inStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.44, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, boxShadow: "0 18px 48px rgba(37,99,235,0.10)" }}
      className="group bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:border-blue-200 relative"
    >
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
          <BadgePercent size={9} />
          {discount}% OFF
        </div>
      )}

      {/* Wishlist button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm hover:border-red-200 transition-all"
      >
        <Heart
          size={13}
          className={`transition-colors ${wishlisted ? "text-red-500" : "text-slate-400"}`}
          fill={wishlisted ? "#EF4444" : "none"}
        />
      </motion.button>

      {/* Product image */}
      <div className="relative h-[140px] bg-gradient-to-br from-slate-50 to-blue-50/40 overflow-hidden flex items-center justify-center">
        <motion.img
          src={med.img}
          alt={med.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {!med.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Category */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${med.catBg} ${med.catColor}`}>
          {med.category}
        </span>

        {/* Name */}
        <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{med.name}</p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-black text-slate-900">₹{med.price.toLocaleString()}</span>
          <span className="text-xs text-slate-400 line-through">MRP ₹{med.mrp.toLocaleString()}</span>
        </div>

        {/* Stock status */}
        {med.inStock && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-600">In Stock</span>
          </div>
        )}

        {/* Add to Cart */}
        <motion.button
          whileHover={med.inStock && !added ? { scale: 1.03, boxShadow: "0 6px 20px rgba(37,99,235,0.22)" } : {}}
          whileTap={med.inStock && !added ? { scale: 0.96 } : {}}
          onClick={handleAddToCart}
          disabled={!med.inStock}
          className={`relative w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl border transition-all duration-200 overflow-hidden ${
            !med.inStock
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              : added
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "bg-white border-slate-200 text-slate-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
          }`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-1.5"
              >
                <CheckCircle2 size={13} />
                Added to Cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingCart size={13} />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function PharmacySection2() {
  return (
    <section className="w-full mt-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-5"
      >
        <h2 className="text-lg font-bold text-slate-900">Popular Medicines</h2>
        <motion.button
          whileHover={{ x: 2 }}
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
          <ChevronRight size={15} />
        </motion.button>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {MEDICINES.map((med, i) => (
          <MedicineCard key={med.id} med={med} delay={i * 0.06} />
        ))}
      </div>
    </section>
  );
}
