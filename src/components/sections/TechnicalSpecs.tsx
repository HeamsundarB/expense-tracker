"use client";

import React, { useState } from "react";
import { Cpu, ShieldCheck, Terminal, Blocks, Zap, Network, ListChecks } from "lucide-react";
import { playSound } from "@/utils/audio";
import { motion, AnimatePresence } from "framer-motion";

interface Spec {
  id: number;
  label: string;
  icon: React.ReactNode;
  subtitle: string;
  desc: string;
  metrics: string[];
}

const SPECS: Spec[] = [
  {
    id: 0,
    label: "AI Inference",
    icon: <Cpu className="w-5 h-5" />,
    subtitle: "Quantized Deep Neural Network (FP16)",
    desc: "Dynamic classification model trained on modern payload entropy datasets, operating directly at the kernel NIC driver layer to minimize routing delays.",
    metrics: ["Inference Time: 15 microseconds", "Quantization: FP16/INT8", "Acc: 99.8% on CICIDS2017"],
  },
  {
    id: 1,
    label: "Block Ledger",
    icon: <Blocks className="w-5 h-5" />,
    subtitle: "Lightweight Private Blockchain DB",
    desc: "Decentralized log verification database hashing traffic logs and rule changes. Guarantees immutable security audits for network operators.",
    metrics: ["Block confirmation: < 500ms", "Hash algorithm: SHA-256", "Consensus: Proof of Authority"],
  },
  {
    id: 2,
    label: "Zero Trust",
    icon: <Network className="w-5 h-5" />,
    subtitle: "Continuous Authorization Pipeline",
    desc: "Identity validation and device posture scoring. Binds access requests directly to micro-segmented targets, completely blocking lateral motion.",
    metrics: ["Dynamic Trust scoring", "Contextual location audits", "MFA validation checks"],
  },
  {
    id: 3,
    label: "DPI Engine",
    icon: <Terminal className="w-5 h-5" />,
    subtitle: "Deep Packet Inspection & Payload Analysis",
    desc: "Inspects full TCP/UDP streams up to layer 7. Decodes SSL/TLS headers and evaluates payload entropy scales to detect polymorphic scripting.",
    metrics: ["Decryption rate: 1.2 Gbps", "Entropy scan window: 64 bytes", "TCP reassembly: < 8μs"],
  },
  {
    id: 4,
    label: "Scrubbing Core",
    icon: <ShieldCheck className="w-5 h-5" />,
    subtitle: "DDoS Mitigation & Rate Throttling",
    desc: "Monitors packet intervals. Instantly isolates source IPs that exceed thresholds, dropping volumetric attacks at the interface level.",
    metrics: ["Scrubbing rate: 10 Gbps", "Drop rule latency: < 5μs", "IP blacklisting capacity: 1M+"],
  },
  {
    id: 5,
    label: "Performance",
    icon: <Zap className="w-5 h-5" />,
    subtitle: "Line Rate Processing Budget",
    desc: "Specially optimized C++ kernel bypass modules ensuring line rate routing throughput even during critical heavy load classification spikes.",
    metrics: ["Max line rate: 10 Gbps", "CPU core affinity: Dedicated 4", "Memory footprint: < 120MB"],
  },
];

export default function TechnicalSpecs() {
  const [selectedSpec, setSelectedSpec] = useState<number>(0);

  const handleSelectSpec = (id: number) => {
    playSound("click");
    setSelectedSpec(id);
  };

  return (
    <section id="specs" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-neon flex items-center justify-center space-x-1.5">
            <ListChecks className="w-4 h-4" />
            <span>Specifications Grid</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
            Under-The-Hood Architecture
          </h2>
          <p className="text-gray-400 font-mono text-xs">
            Interact with the hexagonal categories to inspect detailed software specifications, throughput budgets, and memory constraints.
          </p>
        </div>

        {/* Specs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center font-mono">
          
          {/* Hex Grid Left */}
          <div className="lg:col-span-6 flex justify-center py-6">
            <div className="grid grid-cols-3 gap-3 w-full max-w-[420px]">
              {SPECS.map((spec) => {
                const isSelected = selectedSpec === spec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => handleSelectSpec(spec.id)}
                    onMouseEnter={() => playSound("hover")}
                    className={`aspect-square p-0.5 rounded-none flex items-center justify-center cursor-pointer transition-all duration-300 hexagon-border relative ${
                      isSelected
                        ? "scale-[1.05] z-10 shadow-neon"
                        : "opacity-65 hover:opacity-95"
                    }`}
                  >
                    <div
                      className={`w-full h-full hexagon flex flex-col items-center justify-center space-y-2 select-none ${
                        isSelected
                          ? "bg-cyber-blue/80 text-cyber-neon"
                          : "bg-cyber-blue/20 text-gray-400 hover:bg-cyber-blue/40"
                      }`}
                    >
                      <div className="p-1 rounded bg-cyber-dark/40 border border-cyber-neon/10">
                        {spec.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {spec.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Panel Right */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl glass-panel p-8 bg-cyber-blue/15 border border-cyber-neon/15 min-h-[300px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSpec}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[9px] text-cyber-neon uppercase tracking-widest font-bold">
                      Component Specs • Layer {SPECS[selectedSpec].id + 1}
                    </span>
                    <h3 className="text-white text-xl font-bold uppercase tracking-wider mt-1">
                      {SPECS[selectedSpec].subtitle}
                    </h3>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">
                    {SPECS[selectedSpec].desc}
                  </p>

                  <div className="border-t border-cyber-neon/10 pt-4 space-y-2">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                      Core Benchmarks:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SPECS[selectedSpec].metrics.map((metric, i) => (
                        <div key={i} className="text-[10px] text-gray-300 flex items-center space-x-2">
                          <span className="w-1 h-1 rounded-full bg-cyber-emerald" />
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
