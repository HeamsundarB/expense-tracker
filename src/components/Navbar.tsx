"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Cpu } from "lucide-react";
import AudioController from "./AudioController";
import { playSound } from "@/utils/audio";

const NAV_ITEMS = [
  { label: "Overview", href: "#hero" },
  { label: "Threat Map", href: "#threat-map" },
  { label: "AI Engine", href: "#ai-engine" },
  { label: "Zero Trust", href: "#zero-trust" },
  { label: "Metrics", href: "#metrics" },
  { label: "Live Portal", href: "#demo" },
  { label: "SIH Journey", href: "#sih-journey" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickLink = () => {
    playSound("click");
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cyber-dark/85 backdrop-blur-md border-b border-cyber-neon/15 shadow-neon/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-cyber-neon/30 bg-cyber-blue/30 text-cyber-neon shadow-neon/10">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-extrabold tracking-wider text-white text-md uppercase text-glow">
                  AEGIS<span className="text-cyber-neon">-FW</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-[9px] font-mono tracking-widest uppercase">
                  Rank 79
                </span>
              </div>
              <div className="text-[9px] text-gray-400 font-mono tracking-tighter uppercase hidden md:block">
                SIH25160 • AI-Driven Zero Trust
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={() => playSound("hover")}
                onClick={handleClickLink}
                className="font-mono text-xs text-gray-400 hover:text-cyber-neon transition-colors duration-200 uppercase tracking-widest relative group"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-cyber-neon transition-all duration-350 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Center */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-cyber-emerald/10 bg-cyber-emerald/5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
              <span className="font-mono text-[9px] text-cyber-emerald uppercase tracking-widest">
                SYSTEM ONLINE
              </span>
            </div>
            <AudioController />
            <a
              href="#demo"
              onMouseEnter={() => playSound("hover")}
              onClick={handleClickLink}
              className="px-4 py-1.5 rounded-lg border border-cyber-neon bg-cyber-neon/10 hover:bg-cyber-neon text-cyber-neon hover:text-cyber-dark font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-neon/15 hover:shadow-neon/30 cursor-pointer"
            >
              Console
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <AudioController />
            <button
              onClick={() => {
                playSound("click");
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="text-gray-400 hover:text-cyber-neon focus:outline-none p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-x-0 border-t border-b border-cyber-neon/20 bg-cyber-dark/95 backdrop-blur-xl absolute top-full left-0 right-0 py-4 px-6 shadow-neon/10 animate-fade-in">
          <div className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={() => playSound("hover")}
                onClick={handleClickLink}
                className="font-mono text-sm text-gray-300 hover:text-cyber-neon transition-colors duration-250 py-1 uppercase tracking-widest border-b border-cyber-neon/5"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
                <span className="font-mono text-[10px] text-cyber-emerald uppercase tracking-widest">
                  SYS SECURE
                </span>
              </div>
              <a
                href="#demo"
                onClick={handleClickLink}
                className="px-5 py-2 rounded-lg border border-cyber-neon text-cyber-neon text-center font-mono text-xs uppercase tracking-wider bg-cyber-neon/5"
              >
                Launch Console
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
