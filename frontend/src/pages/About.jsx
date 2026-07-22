import React from 'react';
import { Sparkles, Heart, Package, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const pillars = [
    {
      icon: Sparkles,
      title: "Artisanal Detail",
      desc: "Every loops and stitches are carefully calibrated. We work slowly, enjoying the tactile process of bringing yarn to life, resulting in pieces that bear the distinct warmth of human hands."
    },
    {
      icon: Leaf,
      title: "Natural & Safe Fibers",
      desc: "We select premium, skin-friendly cotton and velvet threads. Safety eyes are locked securely on amigurumis, and all fill fibers are fully hypoallergenic, ensuring our toys are baby-safe."
    },
    {
      icon: Heart,
      title: "Aesthetic Gifting",
      desc: "We believe a handmade gift should feel special from the first glance. All creations are tucked into signature brown Kraft boxes, complete with custom packaging paper and cards."
    },
    {
      icon: Package,
      title: "Small-Batch Values",
      desc: "We intentionally avoid bulk manufacturing. Creating in limited runs allows us to focus entirely on quality checks, tailoring designs, and minimizing material waste."
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-brand-beige/35 border-b border-brand-beige/30 py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-rose">The Story Behind the Stitches</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-charcoal leading-tight">About Eyara Essence</h1>
          <p className="text-brand-brown text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            A small independent studio dedicated to crafting slow, beautiful, and cozy crochet goods that add a touch of warmth to your home and daily lifestyle.
          </p>
        </div>
      </section>

      {/* 2. Brand Story Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">
              Bridging Traditional Crochet with Modern Aesthetics
            </h2>
            <div className="text-brand-brown text-sm sm:text-base space-y-4 leading-relaxed">
              <p>
                Eyara Essence was born out of a deep admiration for the art of crochet. In a world characterized by speed and automation, we seek solace in the slow rhythm of the crochet hook. There is a quiet magic in watching a single, continuous strand of yarn slowly transform into a three-dimensional bunny, a delicate bookmark, or a cute floral keychain.
              </p>
              <p>
                Our philosophy is simple: we make things that last, things that hold memories, and things that make thoughtful gifts. Every single design is carefully prototyped, adjusting stitch counts and tension until we find the perfect balance between structure, softness, and cozy visual appeal.
              </p>
              <p>
                When you buy from Eyara Essence, you aren't just buying a product. You are supporting hours of focused design, dedicated craftsmanship, and a commitment to keeping handiwork alive.
              </p>
            </div>
          </div>

          {/* Story Image */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-md border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80"
                alt="Cozy yarn crochet hook set"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Pillars Grid */}
      <section className="bg-brand-beige/10 border-y border-brand-beige/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-charcoal">Craftsmanship Standards</h2>
            <p className="text-brand-brown text-sm mt-2">What goes into every single knot and package we prepare.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {pillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div key={pillar.title} className="flex gap-4 p-6 bg-white border border-brand-beige/25 rounded-2xl shadow-xs">
                  <div className="p-3 bg-brand-blush/30 text-brand-rose rounded-xl flex-shrink-0 self-start">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-brand-charcoal font-sans uppercase tracking-wider">{pillar.title}</h3>
                    <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Gifting Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-beige/35 border border-brand-beige/50 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">Looking for a Thoughtful Gift?</h2>
          <p className="text-brand-brown text-sm sm:text-base leading-relaxed">
            All our orders are packaged beautifully by default in elegant Kraft boxes, ready to ship directly to the lucky recipient. Customize a handwritten note at checkout or contact us for personalized commissions.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-brand-rose hover:bg-brand-rose-dark text-white font-semibold text-sm rounded-xl transition-smooth shadow-sm"
            >
              Browse Gift Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
