import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface SalesPageProps {
  onLoginClick: () => void;
}


const PixelBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.07]">
    {/* Grid */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}
    />
    
    {/* Tetris shapes */}
    {/* T-shape */}
    <div className="absolute top-24 left-10 flex flex-wrap" style={{ width: '96px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>
    
    {/* Square */}
    <div className="absolute top-64 right-20 flex flex-wrap" style={{ width: '64px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>

    {/* L-shape */}
    <div className="absolute bottom-40 left-[20%] flex flex-wrap" style={{ width: '64px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>
    
    {/* S-shape */}
    <div className="absolute top-32 right-[30%] flex flex-wrap" style={{ width: '96px' }}>
      <div className="w-8 h-8 opacity-0"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 opacity-0"></div>
    </div>
    
    {/* Line */}
    <div className="absolute top-[60%] right-[10%] flex flex-wrap" style={{ width: '32px' }}>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
      <div className="w-8 h-8 bg-black"></div>
    </div>
  </div>
);

export function SalesPage({ onLoginClick }: SalesPageProps) {
  return (
    <div 
      className="min-h-screen text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white relative bg-[#fafafa]"
    >
      {/* Navigation */}
      <PixelBackground />
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight">KDP MonoCrafter</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onLoginClick}
            className="px-5 py-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Login
          </button>
          
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1]"
        >
          Publish Monochrome <br className="hidden md:block"/> Mystery Books in Minutes.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-600 max-w-2xl mb-10"
        >
          Stop struggling with complex formatting. Generate ready-to-publish 100-page mystery activity books for Amazon KDP with a single click.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={onLoginClick}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
          >
            Get Started <ArrowRight size={20} />
          </button>
          
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 border-y border-neutral-200 bg-white/60 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-black">Lightning Fast</h3>
              <p className="text-neutral-600">Generate complete 100-page interior manuscripts instantly. No waiting, no complex software required.</p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-black">KDP Optimized</h3>
              <p className="text-neutral-600">Perfectly sized and formatted for Amazon KDP printing standards. Zero bleed errors, guaranteed.</p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-black">Commercial Rights</h3>
              <p className="text-neutral-600">You own 100% of the rights to the books you generate. Publish, sell, and keep all the royalties.</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="py-12 text-center border-t border-neutral-200 bg-white/80 backdrop-blur-md relative z-10">
        <p className="text-neutral-500 font-medium">Copyright by KoJi Academy</p>
      </footer>
    </div>
  );
}
