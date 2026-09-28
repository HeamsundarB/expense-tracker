"use client";

import React, { useState, useRef } from "react";
import { Mail, ShieldCheck, Building, User, Send } from "lucide-react";
import { playSound } from "@/utils/audio";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [msg, setMsg] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Bounding ref for magnetic CTA button
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Magnetic pull distance boundary
    const dist = Math.sqrt(x * x + y * y);
    if (dist < 80) {
      setBtnOffset({ x: x * 0.35, y: y * 0.35 });
    } else {
      setBtnOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setBtnOffset({ x: 0, y: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");

    // Simple validations
    const errors: string[] = [];
    if (!name) errors.push("Name field required.");
    if (!email || !email.includes("@")) errors.push("Valid email token required.");
    if (!msg) errors.push("Payload message required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      playSound("block");
      return;
    }

    setValidationErrors([]);
    setLoading(true);

    // Simulate database write
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      playSound("success");

      // Custom cyber-themed confetti explosion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00F5FF", "#00D4AA", "#0A2540"],
      });
    }, 1500);
  };

  return (
    <section id="contact" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Collaboration Details */}
        <div className="lg:col-span-5 space-y-8 font-mono">
          <div className="space-y-4">
            <span className="text-xs text-cyber-neon tracking-widest uppercase flex items-center space-x-1.5">
              <Mail className="w-4 h-4" />
              <span>Institutional Collaboration</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
              Initialize Connection
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              We are actively looking for commercial pilot deployments, institutional research partnerships, and security audits. Reach out to coordinate protocol scopes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-800 bg-cyber-dark/40 space-y-2">
            <div className="text-[10px] text-cyber-neon font-bold uppercase">
              SIH Project Identifiers:
            </div>
            <div className="text-[9px] text-gray-500 space-y-1">
              <div>• CATEGORY: Software</div>
              <div>• DOMAIN: Blockchain & Cybersecurity</div>
              <div>• SPONSOR: AICTE National Board</div>
              <div>• DEVELOPMENT RANK: #79 / 500</div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Console */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl glass-panel p-8 bg-cyber-blue/15 border border-cyber-neon/15 relative overflow-hidden min-h-[420px] flex flex-col justify-center font-mono">
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center justify-between">
                    <span>TRANSMIT SECURITY REQUEST</span>
                    <span>STATUS: READY</span>
                  </div>

                  {/* Errors block */}
                  {validationErrors.length > 0 && (
                    <div className="p-3 rounded border border-cyber-red/30 bg-cyber-red/5 text-[9px] text-cyber-red space-y-0.5">
                      {validationErrors.map((err, idx) => (
                        <div key={idx}>➔ {err}</div>
                      ))}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-cyber-neon" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onFocus={() => playSound("hover")}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Advait Nair"
                      className="w-full bg-cyber-dark/80 border border-cyber-neon/15 focus:border-cyber-neon rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyber-neon/30 transition-all duration-300"
                    />
                  </div>

                  {/* Email & Org Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyber-neon" />
                        <span>Corporate Email</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onFocus={() => playSound("hover")}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nair@aegis-security.com"
                        className="w-full bg-cyber-dark/80 border border-cyber-neon/15 focus:border-cyber-neon rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyber-neon/30 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <Building className="w-3.5 h-3.5 text-cyber-neon" />
                        <span>Organization</span>
                      </label>
                      <input
                        type="text"
                        value={org}
                        onFocus={() => playSound("hover")}
                        onChange={(e) => setOrg(e.target.value)}
                        placeholder="AICTE Research Wing"
                        className="w-full bg-cyber-dark/80 border border-cyber-neon/15 focus:border-cyber-neon rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyber-neon/30 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Message payload */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider">Message Payload</label>
                    <textarea
                      rows={3}
                      value={msg}
                      onFocus={() => playSound("hover")}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Specify cooperation parameters..."
                      className="w-full bg-cyber-dark/80 border border-cyber-neon/15 focus:border-cyber-neon rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyber-neon/30 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      ref={buttonRef}
                      type="submit"
                      disabled={loading}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className="px-6 py-2.5 rounded-lg border border-cyber-neon bg-cyber-neon text-cyber-dark font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-neon hover:bg-transparent hover:text-cyber-neon cursor-pointer flex items-center space-x-2"
                      style={{
                        transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                      }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{loading ? "TRANSMITTING..." : "TRANSMIT PATH"}</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 max-w-sm mx-auto"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full border border-cyber-emerald/40 bg-cyber-emerald/10 flex items-center justify-center text-cyber-emerald shadow-emerald">
                      <ShieldCheck className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-bold uppercase tracking-wider">
                      Transmission Confirmed
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Your connection payload has been encrypted and sent to Aegis project operators. We will audit your request within 24 hours.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        playSound("click");
                        setSubmitted(false);
                        setName("");
                        setEmail("");
                        setOrg("");
                        setMsg("");
                      }}
                      className="px-6 py-2 border border-cyber-neon/40 text-cyber-neon hover:bg-cyber-neon/10 rounded text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      New Transmission
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
