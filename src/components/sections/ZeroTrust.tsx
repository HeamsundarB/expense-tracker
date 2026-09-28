"use client";

import React, { useState } from "react";
import { KeyRound, Smartphone, Fingerprint, Cpu, Lock, CheckCircle2, AlertTriangle, ArrowDown } from "lucide-react";
import { playSound } from "@/utils/audio";
import { motion, AnimatePresence } from "framer-motion";

export default function ZeroTrust() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [mfaValid, setMfaValid] = useState(true);
  const [avActive, setAvActive] = useState(true);
  const [osPatched, setOsPatched] = useState(true);
  const [authStatus, setAuthStatus] = useState<"idle" | "evaluating" | "granted" | "denied">("idle");
  const [deniedLayer, setDeniedLayer] = useState<number | null>(null);

  const layers = [
    {
      title: "Identity Verification",
      icon: <Fingerprint className="w-5 h-5" />,
      desc: "Multi-Factor Authentication (MFA), biometric matching, and session token encryption.",
      checks: ["User credentials validation", "MFA cryptographic check", "Contextual behavior match"],
    },
    {
      title: "Device Posture Score",
      icon: <Smartphone className="w-5 h-5" />,
      desc: "Ensures the client device is compliant with security policies before assigning a dynamic Trust Score.",
      checks: ["Antivirus service status", "Operating system patch level", "Firewall rules enabled"],
    },
    {
      title: "Micro-Segmentation Policy",
      icon: <Cpu className="w-5 h-5" />,
      desc: "Isolates network zones. Client gets access *only* to the specific resource, denying lateral movement.",
      checks: ["Virtual network boundary setup", "Least privilege access matrix", "Dynamic path binding"],
    },
    {
      title: "Cryptographic Audit Ledger",
      icon: <Lock className="w-5 h-5" />,
      desc: "Hashes session telemetry and registers access logs onto the distributed blockchain database.",
      checks: ["Session metadata hashing", "Private ledger block broadcast", "Non-repudiation seal"],
    },
  ];

  const handleRunAuthentication = () => {
    playSound("click");
    setAuthStatus("evaluating");
    setDeniedLayer(null);

    // Timeline steps
    setTimeout(() => {
      // Step 1 check
      if (!mfaValid) {
        setAuthStatus("denied");
        setDeniedLayer(0);
        playSound("block");
        return;
      }
      
      setTimeout(() => {
        // Step 2 check
        if (!avActive || !osPatched) {
          setAuthStatus("denied");
          setDeniedLayer(1);
          playSound("block");
          return;
        }

        setTimeout(() => {
          // Success
          setAuthStatus("granted");
          playSound("success");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <section id="zero-trust" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: 3D Stack Graphic */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative h-[420px] flex flex-col justify-between items-center">
            {layers.map((layer, index) => {
              let statusColor = "border-cyber-neon/30 text-cyber-neon bg-cyber-blue/20";
              
              if (authStatus === "evaluating") {
                statusColor = "border-cyber-neon bg-cyber-blue/30 text-cyber-neon animate-pulse";
              } else if (authStatus === "granted") {
                statusColor = "border-cyber-emerald bg-cyber-emerald/10 text-cyber-emerald shadow-emerald/10";
              } else if (authStatus === "denied") {
                if (deniedLayer === index) {
                  statusColor = "border-cyber-red bg-cyber-red/10 text-cyber-red shadow-red/10 scale-[1.03]";
                } else if (deniedLayer !== null && index > deniedLayer) {
                  statusColor = "border-gray-800 text-gray-600 bg-transparent opacity-30";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => {
                    playSound("click");
                    setActiveLayer(index);
                  }}
                  className={`w-full max-w-md p-4 rounded-xl border font-mono text-left transition-all duration-300 relative flex items-center justify-between cursor-pointer ${statusColor} ${
                    activeLayer === index ? "ring-1 ring-cyber-neon shadow-neon/10" : ""
                  }`}
                  style={{
                    transform: `perspective(800px) rotateX(10deg) translateY(-${index * 5}px)`,
                    zIndex: 10 - index,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg border border-current/20 flex items-center justify-center">
                      {layer.icon}
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider">{layer.title}</h4>
                      <span className="text-[9px] text-gray-400">Layer {index + 1} of 4</span>
                    </div>
                  </div>
                  <div className="text-[10px] uppercase font-bold">
                    {authStatus === "granted" && "VERIFIED"}
                    {authStatus === "denied" && deniedLayer === index && "BLOCK"}
                    {authStatus === "denied" && deniedLayer !== null && index > deniedLayer && "HALTED"}
                    {authStatus === "idle" && "READY"}
                    {authStatus === "evaluating" && "SCANNING..."}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive details and controls */}
        <div className="lg:col-span-6 space-y-8 font-mono">
          <div className="space-y-4">
            <span className="text-xs text-cyber-neon tracking-widest uppercase flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4" />
              <span>Identity-Aware Least Privilege Core</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
              Zero Trust Verification Pipeline
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Every request is dynamically authenticated, authorized, and cryptographically verified at each gateway layer. Trust is never static.
            </p>
          </div>

          {/* Interactive controls */}
          <div className="p-5 rounded-xl border border-cyber-neon/15 bg-cyber-blue/20 space-y-5">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">
              Set Security Telemetry:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 text-[11px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mfaValid}
                  onChange={(e) => {
                    playSound("click");
                    setMfaValid(e.target.checked);
                  }}
                  className="rounded border-gray-800 bg-cyber-dark text-cyber-neon focus:ring-cyber-neon w-4 h-4 cursor-pointer"
                />
                <span>MFA Token Valid</span>
              </label>

              <label className="flex items-center space-x-3 text-[11px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avActive}
                  onChange={(e) => {
                    playSound("click");
                    setAvActive(e.target.checked);
                  }}
                  className="rounded border-gray-800 bg-cyber-dark text-cyber-neon focus:ring-cyber-neon w-4 h-4 cursor-pointer"
                />
                <span>Antivirus Secure</span>
              </label>

              <label className="flex items-center space-x-3 text-[11px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={osPatched}
                  onChange={(e) => {
                    playSound("click");
                    setOsPatched(e.target.checked);
                  }}
                  className="rounded border-gray-800 bg-cyber-dark text-cyber-neon focus:ring-cyber-neon w-4 h-4 cursor-pointer"
                />
                <span>OS Fully Patched</span>
              </label>
            </div>

            {/* Verification Button */}
            <div className="pt-2">
              <button
                onClick={handleRunAuthentication}
                disabled={authStatus === "evaluating"}
                className="w-full py-2.5 rounded-lg border border-cyber-neon bg-cyber-neon/15 hover:bg-cyber-neon text-cyber-neon hover:text-cyber-dark font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Validate Path Authorization</span>
              </button>
            </div>

            {/* Dynamic Status Output */}
            <AnimatePresence mode="wait">
              {authStatus !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border flex items-start space-x-3 text-xs ${
                    authStatus === "granted"
                      ? "border-cyber-emerald bg-cyber-emerald/5 text-cyber-emerald"
                      : authStatus === "denied"
                      ? "border-cyber-red bg-cyber-red/5 text-cyber-red"
                      : "border-cyber-neon/40 bg-cyber-blue/30 text-cyber-neon"
                  }`}
                >
                  {authStatus === "granted" && (
                    <>
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 animate-bounce" />
                      <div>
                        <div className="font-bold uppercase">ACCESS GRANTED</div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Secure tunnel initialized. DB connection routed. Blockchain log signed.
                        </p>
                      </div>
                    </>
                  )}
                  {authStatus === "denied" && (
                    <>
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-bold uppercase">ACCESS DENIED</div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Failed validation at Layer {deniedLayer !== null ? deniedLayer + 1 : 0}: {
                            deniedLayer === 0
                              ? "Identity credentials/MFA signature verification failure."
                              : "Device posture check failed. Compliancy error."
                          }
                        </p>
                      </div>
                    </>
                  )}
                  {authStatus === "evaluating" && (
                    <>
                      <ArrowDown className="w-5 h-5 flex-shrink-0 animate-bounce" />
                      <div>
                        <div className="font-bold uppercase">EVALUATING PIPELINE...</div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Running identity scans, auditing device compliance variables, verifying segment binding.
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Details panel of active layer */}
          <div className="p-4 rounded-xl border border-gray-800 bg-cyber-dark/65 min-h-[110px]">
            <div className="text-[10px] text-cyber-neon uppercase tracking-widest font-bold mb-1">
              Active Layer Inspector: {layers[activeLayer].title}
            </div>
            <p className="text-[11px] text-gray-300 mb-2 leading-relaxed">
              {layers[activeLayer].desc}
            </p>
            <div className="flex flex-wrap gap-2">
              {layers[activeLayer].checks.map((chk, i) => (
                <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-cyber-blue/30 border border-cyber-neon/10 text-gray-400">
                  ✔ {chk}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
