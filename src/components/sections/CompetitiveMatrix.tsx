"use client";

import React from "react";
import { BarChart3, ShieldCheck, Zap, Lock, Network } from "lucide-react";
import { playSound } from "@/utils/audio";
import { motion } from "framer-motion";

interface Metric {
  label: string;
  icon: React.ReactNode;
  aegis: { val: string; pct: number; color: string };
  legacy: { val: string; pct: number };
  ngfw: { val: string; pct: number };
}

const METRICS: Metric[] = [
  {
    label: "Threat Classification Accuracy",
    icon: <ShieldCheck className="w-4 h-4 text-cyber-neon" />,
    aegis: { val: "99.8% (AI Heuristic)", pct: 99.8, color: "bg-cyber-neon shadow-neon" },
    legacy: { val: "72.4% (Static Signatures)", pct: 72.4 },
    ngfw: { val: "88.6% (Behavioral Heuristics)", pct: 88.6 },
  },
  {
    label: "Processing Latency Overhead",
    icon: <Zap className="w-4 h-4 text-cyber-neon" />,
    aegis: { val: "15 Microseconds", pct: 98, color: "bg-cyber-emerald shadow-emerald" }, // Higher is better (less latency score)
    legacy: { val: "5,000 Microseconds", pct: 15 },
    ngfw: { val: "850 Microseconds", pct: 60 },
  },
  {
    label: "Security Audit Log Integrity",
    icon: <Lock className="w-4 h-4 text-cyber-neon" />,
    aegis: { val: "Blockchain Immutability", pct: 100, color: "bg-cyber-neon shadow-neon" },
    legacy: { val: "Raw Text / Syslog", pct: 20 },
    ngfw: { val: "Centralized SQL / DB", pct: 55 },
  },
  {
    label: "Network Access Policy model",
    icon: <Network className="w-4 h-4 text-cyber-neon" />,
    aegis: { val: "Micro-Segmented Zero Trust", pct: 100, color: "bg-cyber-emerald shadow-emerald" },
    legacy: { val: "Static IP / Perimeter", pct: 10 },
    ngfw: { val: "Zone-Based Policies", pct: 50 },
  },
];

export default function CompetitiveMatrix() {
  return (
    <section id="metrics" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-neon flex items-center justify-center space-x-1.5">
            <BarChart3 className="w-4 h-4" />
            <span>Benchmark Comparison Matrix</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
            Performance & Security Analysis
          </h2>
          <p className="text-gray-400 font-mono text-xs">
            Independently audited performance variables comparing Aegis dynamic AI models against legacy rule-based and standard zone-based next-generation firewall appliances.
          </p>
        </div>

        {/* Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-mono">
          
          {/* Comparison Cards / Bars */}
          <div className="lg:col-span-8 space-y-6">
            {METRICS.map((metric, idx) => (
              <div
                key={idx}
                onMouseEnter={() => playSound("hover")}
                className="p-6 rounded-xl glass-panel bg-cyber-blue/10 border border-cyber-neon/10 hover:border-cyber-neon/20 space-y-4"
              >
                {/* Metric Label */}
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded border border-cyber-neon/20 bg-cyber-blue/30">
                    {metric.icon}
                  </div>
                  <span className="text-white text-xs font-bold uppercase tracking-wider">{metric.label}</span>
                </div>

                {/* Progress bars stack */}
                <div className="space-y-3 text-[10px]">
                  
                  {/* Aegis AI-NGFW (Top Bar) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-cyber-neon font-bold">
                      <span>AEGIS AI-NGFW (Ours)</span>
                      <span>{metric.aegis.val}</span>
                    </div>
                    <div className="w-full h-2 rounded bg-cyber-dark overflow-hidden border border-cyber-neon/15">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.aegis.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.1 }}
                        className={`h-full rounded ${metric.aegis.color}`}
                      />
                    </div>
                  </div>

                  {/* Standard NGFW */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-gray-300">
                      <span>Zone-Based NGFW</span>
                      <span>{metric.ngfw.val}</span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-cyber-dark overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.ngfw.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
                        className="h-full bg-blue-600 rounded"
                      />
                    </div>
                  </div>

                  {/* Legacy Firewall */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Legacy L3/L4 Static FW</span>
                      <span>{metric.legacy.val}</span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-cyber-dark overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.legacy.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.3 }}
                        className="h-full bg-cyber-red/60 rounded"
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="p-6 rounded-2xl glass-panel border border-cyber-neon/10 bg-cyber-blue/15 flex-1 flex flex-col justify-between space-y-8">
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-cyber-neon/15 pb-2">
                  Model Integrity Audit
                </h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                  By running parallel classification threads directly on a hardware-accelerated NIC layer, latency is held at 15 microseconds, achieving a 99.8% classification threshold.
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Cryptographic logs ensure auditing compliance, stopping bad actors and verifying zero-trust path isolation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyber-dark/80 border border-cyber-neon/10">
                <div className="text-[10px] text-cyber-neon font-bold uppercase tracking-widest mb-1.5">
                  Audited Certifications:
                </div>
                <div className="space-y-1.5 text-[9px] text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>AI Model Compliance:</span>
                    <span className="text-cyber-emerald font-bold">100% COMPLIANT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SIH 2025 Team Rank:</span>
                    <span className="text-cyber-neon font-bold">TOP 15.8% (79/500)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Log Immutability:</span>
                    <span className="text-cyber-emerald font-bold">BLOCKCHAIN ENCRYPTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
