import React, { useState } from 'react';
import { Trophy } from 'lucide-react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${className} group shrink-0`}>
        {/* Glowing background halo */}
        <div className="absolute inset-0 bg-purple-600/50 rounded-xl blur-md group-hover:bg-purple-500/80 transition-all duration-300"></div>
        
        {/* Shield outline */}
        <div className="absolute inset-0 border border-purple-400/80 bg-slate-950/90 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 group-hover:border-purple-300">
          
          {!imgError ? (
            <img
              src="/logo.png"
              alt="Fúria da Noite Logo"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes('/assets/logo.png')) {
                  img.src = '/assets/logo.png';
                } else {
                  setImgError(true);
                }
              }}
              className="w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <>
              {/* Neon inner border */}
              <div className="absolute inset-0.5 border border-purple-500/30 rounded-[10px]" />
              
              {/* Cyberpunk grill overlay */}
              <div className="absolute inset-0 opacity-10 bg-radial-[circle_at_center,theme(colors.purple.500)_10%,transparent_100%] bg-[size:4px_4px]" />
              
              {/* SVG Fierce Dragon + Shield */}
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4/5 h-4/5 z-10 transition-transform duration-500 group-hover:scale-110"
              >
                {/* Shield Internal Segment */}
                <path
                  d="M15 25C35 25 50 15 50 15C50 15 65 25 85 25C85 55 50 85 50 85C50 85 15 55 15 25Z"
                  stroke="#A855F7"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Dragon Wings background */}
                <path
                  d="M30 40C20 30 15 45 25 52M70 40C80 30 85 45 75 52"
                  stroke="#E9D5FF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Dragon tail and claws */}
                <path
                  d="M38 75C42 78 48 81 50 81C52 81 58 78 62 75"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Intertwining Dragon Body (Glowing White) */}
                <path
                  d="M50 22C42 28 35 34 38 42C41 50 59 50 62 58C65 66 50 72 50 72"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_6px_rgba(168,85,247,1)]"
                />
                {/* Dragon Fierce Eye Details (Cyberpunk Green Glow) */}
                <circle cx="48" cy="32" r="2.5" fill="#22C55E" />
                <path d="M44 29L49 32" stroke="#22C55E" strokeWidth="1.5" />
              </svg>
            </>
          )}
        </div>
        
        {/* Tiny floaty crown/trophy badge */}
        <div className="absolute -top-1 -right-1 bg-green-500 text-slate-950 p-0.5 rounded-full scale-75 shadow-lg border border-slate-950 z-20">
          <Trophy className="w-2.5 h-2.5" />
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-purple-500 tracking-tight leading-none uppercase">
          Fúria da Noite
        </span>
        <span className="text-[9px] font-mono tracking-widest text-[#22C55E] uppercase leading-none font-medium mt-1">
          PUBG Mobile Duo
        </span>
      </div>
    </div>
  );
}
