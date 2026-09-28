"use client";

import React, { useState } from "react";
import { ShieldX, ShieldCheck, Flame, ServerCrash, Clock, DollarSign, Database, FileKey2 } from "lucide-react";
import { playSound } from "@/utils/audio";

export default function ProblemFracture() {
  const [hoverSide, setHoverSide] = useState<"legacy" | "aegis" | null>(null);

  const handleHover = (side: "legacy" | "aegis" | null) => {
    if (side) playSound("hover");
    setHoverSide(side);
  };

  return (
    <section id="problem-fracture" className="relative min-h-screen bg-cyber-dark overflow-hidden py-24 border-t border-cyber-neon/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyber-neon">
            Comparative Vulnerability Analysis
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
            Legacy Failures vs. Next-Gen Shielding
          </h3>
          <p className="text-gray-400 font-mono text-xs">
            Static firewalls fail against polymorphic threats. Aegis uses dynamic AI heuristic models to verify every packet transaction.
          </p>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch font-mono">
          
          {/* Legacy Firewall Section */}
          <div
            onMouseEnter={() => handleHover("legacy")}
            onMouseLeave={() => handleHover(null)}
            className={`rounded-2xl border p-8 transition-all duration-500 flex flex-col justify-between ${
              hoverSide === "legacy"
                ? "border-cyber-red bg-cyber-red/5 shadow-red/10 scale-[1.01]"
                : hoverSide === "aegis"
                ? "border-gray-800 opacity-40"
                : "border-cyber-red/20 bg-cyber-dark/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg border border-cyber-red/30 bg-cyber-red/10 text-cyber-red flex items-center justify-center">
                    <ShieldX className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-wider">Legacy Layer 3/4 Firewall</h4>
                    <span className="text-[9px] text-cyber-red uppercase tracking-widest">Static Rule Engine</span>
                  </div>
                </div>
                <div className="text-[10px] text-cyber-red uppercase tracking-widest flex items-center space-x-1 animate-pulse">
                  <Flame className="w-3.5 h-3.5" />
                  <span>VULNERABLE</span>
                </div>
              </div>

              {/* Failing Timeline */}
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-cyber-red/30 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-cyber-red bg-cyber-dark flex items-center justify-center text-[8px] text-cyber-red font-bold">
                      1
                    </span>
                    <div className="text-white text-xs font-bold uppercase">SQL Injection Leakage</div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Payload bypassed signature filters via ASCII hex encoding. Core SQL database compromised.
                    </p>
                    <div className="mt-1.5 flex items-center space-x-3 text-[9px] text-cyber-red">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 00:00:02s</span>
                      <span className="flex items-center"><DollarSign className="w-3 h-3 mr-0.5" /> $4.2M Leakage</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-cyber-red bg-cyber-dark flex items-center justify-center text-[8px] text-cyber-red font-bold">
                      2
                    </span>
                    <div className="text-white text-xs font-bold uppercase">Privilege Escalation</div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Lack of micro-segmentation allowed lateral movement. Active Directory admin tokens hijacked.
                    </p>
                    <div className="mt-1.5 flex items-center space-x-3 text-[9px] text-cyber-red">
                      <span className="flex items-center"><Database className="w-3 h-3 mr-1" /> AD database copy</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-cyber-red bg-cyber-dark flex items-center justify-center text-[8px] text-cyber-red font-bold">
                      3
                    </span>
                    <div className="text-white text-xs font-bold uppercase">Ransomware Deployment</div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      All central server logs encrypted. Core backup systems locked down due to broad network access.
                    </p>
                    <div className="mt-1.5 flex items-center space-x-3 text-[9px] text-cyber-red">
                      <span className="flex items-center"><FileKey2 className="w-3 h-3 mr-1" /> Files locked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-cyber-red/10 pt-4 flex items-center space-x-2 text-[10px] text-gray-500">
              <ServerCrash className="w-4 h-4 text-cyber-red" />
              <span>Result: Server Encrypted, Total Downtime, Compliance Violation.</span>
            </div>
          </div>

          {/* Aegis Next-Gen Firewall Section */}
          <div
            onMouseEnter={() => handleHover("aegis")}
            onMouseLeave={() => handleHover(null)}
            className={`rounded-2xl border p-8 transition-all duration-500 flex flex-col justify-between ${
              hoverSide === "aegis"
                ? "border-cyber-emerald bg-cyber-emerald/5 shadow-emerald/10 scale-[1.01]"
                : hoverSide === "legacy"
                ? "border-gray-800 opacity-40"
                : "border-cyber-emerald/20 bg-cyber-dark/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg border border-cyber-emerald/30 bg-cyber-emerald/10 text-cyber-emerald flex items-center justify-center shadow-emerald/15">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-wider">Aegis Next-Gen AI-FW</h4>
                    <span className="text-[9px] text-cyber-emerald uppercase tracking-widest">Zero Trust Model Integration</span>
                  </div>
                </div>
                <div className="text-[10px] text-cyber-emerald uppercase tracking-widest flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
                  <span className="text-glow-emerald">PROTECTED</span>
                </div>
              </div>

              {/* Interception Timeline */}
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-cyber-emerald/30 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-cyber-emerald bg-cyber-dark flex items-center justify-center text-[8px] text-cyber-emerald font-bold shadow-emerald/20">
                      1
                    </span>
                    <div className="text-white text-xs font-bold uppercase">Polymorphic Query Detection</div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      AI behavioral analytics detects abnormal entropy and SQLi patterns. Risk score calculated: 94%.
                    </p>
                    <div className="mt-1.5 flex items-center space-x-3 text-[9px] text-cyber-emerald">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Latency: 15μs</span>
                      <span className="flex items-center">Score: 94% CRITICAL</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-cyber-emerald bg-cyber-dark flex items-center justify-center text-[8px] text-cyber-emerald font-bold shadow-emerald/20">
                      2
                    </span>
                    <div className="text-white text-xs font-bold uppercase">Automated Micro-Segmentation</div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Zero Trust enforcer isolates the compromised node immediately. Bypasses core AD.
                    </p>
                    <div className="mt-1.5 flex items-center space-x-3 text-[9px] text-cyber-emerald">
                      <span className="flex items-center">Segment Isolated</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border border-cyber-emerald bg-cyber-dark flex items-center justify-center text-[8px] text-cyber-emerald font-bold shadow-emerald/20">
                      3
                    </span>
                    <div className="text-white text-xs font-bold uppercase">Immutable Blockchain Log</div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Threat signature and blocking actions are hashed and cryptographically written to the blockchain ledger.
                    </p>
                    <div className="mt-1.5 flex items-center space-x-3 text-[9px] text-cyber-emerald">
                      <span className="flex items-center">Chained block: #412850</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-cyber-emerald/10 pt-4 flex items-center space-x-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
              <span>Result: Attack Intercepted, Threat Contained, Audited Log Signed.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
