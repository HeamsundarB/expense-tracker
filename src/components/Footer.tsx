"use client";

import React from "react";
import { Cpu, Heart } from "lucide-react";
import { playSound } from "@/utils/audio";

export default function Footer() {
  return (
    <footer className="bg-cyber-dark/95 border-t border-cyber-neon/10 py-12 relative z-30 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800 pb-8">
          
          {/* Logo & Sponsor */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-cyber-neon/30 bg-cyber-blue/30 text-cyber-neon">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white uppercase tracking-wider text-glow">
                AEGIS<span className="text-cyber-neon">-FW</span>
              </span>
              <span className="text-[10px] text-gray-500 block">
                AICTE Sponsored Project SIH25160
              </span>
            </div>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-400">
            <a
              href="#hero"
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className="hover:text-cyber-neon transition-colors"
            >
              Overview
            </a>
            <a
              href="#threat-map"
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className="hover:text-cyber-neon transition-colors"
            >
              Intelligence Map
            </a>
            <a
              href="#demo"
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className="hover:text-cyber-neon transition-colors"
            >
              Platform Console
            </a>
          </div>

        </div>

        {/* Bottom Metadata Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-[9px] text-gray-500">
          <div>
            © {new Date().getFullYear()} Aegis Firewall Dev Team. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-1 justify-center">
            <span>Built for SIH2025 Team Rank 79 with</span>
            <Heart className="w-3 h-3 text-cyber-red animate-pulse" />
            <span>& Blockchain Architecture.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
