import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SalesPageProps {
  onLoginClick: () => void;
}

export function SalesPage({ onLoginClick }: SalesPageProps) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, white 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, white 40%, transparent 100%)'
        }}
      />

      {/* Decorative Blocks */}
      <div className="absolute top-20 left-[10%] w-16 h-8 bg-neutral-200/50 hidden md:block" />
      <div className="absolute top-28 left-[12%] w-8 h-8 bg-neutral-200/50 hidden md:block" />
      
      <div className="absolute top-32 right-[25%] w-12 h-8 bg-neutral-200/50 hidden md:block" />
      <div className="absolute top-40 right-[27%] w-16 h-16 bg-neutral-200/50 hidden md:block" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
        <div className="text-xl font-black tracking-tight">KDP MonoCrafter</div>
        <button 
          onClick={onLoginClick}
          className="text-sm font-semibold hover:text-neutral-600 transition-colors"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] mb-6">
          Publish Monochrome<br />
          Mystery Books in Minutes.
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mb-10 leading-relaxed">
          Stop struggling with complex formatting. Generate ready-to-publish 100-page mystery activity books for Amazon KDP with a single click.
        </p>
        <button 
          onClick={onLoginClick}
          className="group flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
        >
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-neutral-100 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div>
            <h3 className="text-2xl font-black mb-4">Lightning Fast</h3>
            <p className="text-neutral-600 leading-relaxed">
              Generate complete 100-page interior manuscripts instantly. No waiting, no complex software required.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div>
            <h3 className="text-2xl font-black mb-4">KDP Optimized</h3>
            <p className="text-neutral-600 leading-relaxed">
              Perfectly sized and formatted for Amazon KDP printing standards. Zero bleed errors, guaranteed.
            </p>
          </div>

          {/* Feature 3 */}
          <div>
            <h3 className="text-2xl font-black mb-4">Commercial Rights</h3>
            <p className="text-neutral-600 leading-relaxed">
              You own 100% of the rights to the books you generate. Publish, sell, and keep all the royalties.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
