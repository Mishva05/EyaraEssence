import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Gift, Sparkles, Heart, Package } from 'lucide-react';
import { apiService } from '../services/api';
import ProductCard from '../components/Product/ProductCard';
import Spinner from '../components/Feedback/Spinner';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await apiService.getProducts({ sortBy: 'bestseller' });
        // Take first 4 bestseller/featured products
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const categories = [
    { name: "Amigurumis", count: "3 items", image: "https://images.unsplash.com/photo-1608889174653-81c9b6b3e1d6?w=400&auto=format&fit=crop&q=80" },
    { name: "Keychains", count: "2 items", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80" },
    { name: "Bookmarks", count: "1 item", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80" },
    { name: "Earphone Cases", count: "1 item", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" },
    { name: "Mini Card Holders", count: "1 item", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&auto=format&fit=crop&q=80" },
    { name: "Bracelets", count: "1 item", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&auto=format&fit=crop&q=80" },
    { name: "Headbands", count: "1 item", image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400&auto=format&fit=crop&q=80" },
    { name: "Bandanas", count: "1 item", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=80" },
    { name: "Car Hangers", count: "2 items", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop&q=80" },
    { name: "Small Organizers", count: "2 items", image: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=400&auto=format&fit=crop&q=80" }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "Handmade with Care",
      desc: "Every item is slowly hand-crocheted stitch-by-stitch with high-grade, skin-friendly yarn."
    },
    {
      icon: Heart,
      title: "Unique Designs",
      desc: "No two handmade items are ever perfectly identical, giving your product its own unique character."
    },
    {
      icon: Gift,
      title: "Thoughtful Gifting",
      desc: "Packaged with cozy aesthetic wraps and tags, ready to put smiles on your loved ones' faces."
    },
    {
      icon: Package,
      title: "Made in Small Batches",
      desc: "We prioritize quality over mass production, designing items in cozy, limited-edition runs."
    }
  ];

  const testimonials = [
    {
      text: "The cozy bunny plush is unbelievably soft! My daughter takes it everywhere. The handiwork is absolutely flawless and you can tell it was made with love.",
      author: "Aditi S.",
      city: "Mumbai"
    },
    {
      text: "The trailing plant car hanger is the cutest thing in my car! I get compliments on it from everyone who rides with me. Quality is incredible.",
      author: "Rohan M.",
      city: "Bangalore"
    },
    {
      text: "I bought the vintage banana bandana and it fits perfectly. Lightweight, beautiful scalloped detail, and soft. Highly recommend Eyara Essence!",
      author: "Priya K.",
      city: "New Delhi"
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative bg-brand-beige/35 py-12 sm:py-20 lg:py-24 overflow-hidden border-b border-brand-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="space-y-6 lg:col-span-6 text-center lg:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-rose bg-brand-rose/10">
              <Sparkles className="w-3.5 h-3.5" /> 100% Handcrafted Love
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-brand-charcoal leading-tight">
              Little things, <br />
              <span className="italic text-brand-rose font-medium">lovingly</span> handmade.
            </h1>
            <p className="text-brand-brown text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Discover a curated collection of beautiful, cozy amigurumi plushies, cute keychains, and premium everyday lifestyle accessories crocheted to perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-brand-rose hover:bg-brand-rose-dark text-white font-semibold text-sm rounded-xl transition-smooth shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Shop the Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-white hover:bg-brand-beige/50 text-brand-charcoal border border-brand-beige font-semibold text-sm rounded-xl transition-smooth flex items-center justify-center"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:rotate-1 transition-smooth duration-500">
              <img
                src="https://images.unsplash.com/photo-1606744824163-985d376605aa?w=700&auto=format&fit=crop&q=80"
                alt="Beautiful knit yarn and crochet hook"
                className="w-full h-full object-cover"
              />
              {/* Floating aesthetic banner */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-brand-beige shadow-lg">
                <p className="text-xs font-serif italic text-brand-charcoal text-center">
                  "Thoughtfully designed, slowly crafted, and packaged sustainably for gifting joy."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-serif text-brand-charcoal mb-3">Shop by Category</h2>
          <p className="text-brand-brown text-sm">Explore our diverse range of handcrafted crochet products made to style your life.</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group relative cursor-pointer aspect-square rounded-2xl overflow-hidden bg-brand-beige border border-brand-beige/40 shadow-xs hover:shadow-md transition-smooth"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-serif font-bold text-sm sm:text-base leading-tight group-hover:text-brand-blush transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-white/80 font-medium tracking-wider uppercase mt-1">
                  {cat.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Bestsellers */}
      <section className="bg-brand-beige/15 py-16 border-y border-brand-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-brand-charcoal mb-2">Our Bestsellers</h2>
              <p className="text-brand-brown text-sm">Customer favorites, hand-knitted and loved by many.</p>
            </div>
            <Link
              to="/shop?filter=bestseller"
              className="inline-flex items-center text-sm font-bold text-brand-rose hover:text-brand-rose-dark transition-colors group"
            >
              View All Bestsellers
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-brand-beige/30 border border-brand-beige/50 rounded-3xl p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
                alt="Crocheting amigurumis"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-rose">Our Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-brand-charcoal leading-tight">
              Slow Craftsmanship, <br />
              Made for Life’s Cozy Moments.
            </h2>
            <div className="text-brand-brown text-sm sm:text-base space-y-4 leading-relaxed">
              <p>
                At Eyara Essence, we believe in slowing down. In a world of fast-moving products, we choose to spend hours wrapping yarn, shaping structures, and perfecting details for each individual piece.
              </p>
              <p>
                From whimsical amigurumi bunnies that bring comfort, to mini plant hangers that brighten up long drives, our focus is on creating thoughtful products that bring warmth and elegance to your daily life.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center px-6 py-3 bg-brand-charcoal text-white hover:bg-brand-charcoal/90 text-sm font-semibold rounded-xl transition-smooth shadow-sm"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat) => {
            const IconComp = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-white border border-brand-beige/35 text-center space-y-3 hover:shadow-md transition-smooth"
              >
                <div className="w-12 h-12 bg-brand-blush/35 text-brand-rose rounded-full flex items-center justify-center mx-auto">
                  <IconComp className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-brand-charcoal font-sans">{feat.title}</h3>
                <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="bg-brand-beige/10 py-16 border-t border-brand-beige/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-serif text-brand-charcoal mb-2">Loved by Cozy People</h2>
            <p className="text-brand-brown text-sm">Here is what our lovely community has to say about our creations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-brand-beige/30 shadow-xs flex flex-col justify-between"
              >
                <p className="text-brand-charcoal text-sm italic font-serif leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 border-t border-brand-beige/20 pt-4">
                  <div className="w-9 h-9 rounded-full bg-brand-blush/30 flex items-center justify-center font-bold text-sm text-brand-rose">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-charcoal">{t.author}</h4>
                    <span className="text-[10px] text-brand-brown font-medium">{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Instagram Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <h2 className="text-3xl font-bold font-serif text-brand-charcoal mb-2">Follow Our Stitching Journey</h2>
          <p className="text-brand-brown text-sm">Get a peek behind the scenes, workshop logs, and product launches on Instagram.</p>
          <a
            href="#instagram"
            className="inline-block text-sm font-bold text-brand-rose hover:text-brand-rose-dark mt-2"
          >
            @eyara_essence
          </a>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xs bg-brand-beige border border-brand-beige/50">
            <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80" alt="Instagram 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xs bg-brand-beige border border-brand-beige/50">
            <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80" alt="Instagram 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xs bg-brand-beige border border-brand-beige/50">
            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80" alt="Instagram 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xs bg-brand-beige border border-brand-beige/50">
            <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop&q=80" alt="Instagram 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </section>

    </div>
  );
}
