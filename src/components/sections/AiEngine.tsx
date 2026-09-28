"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal, ShieldCheck, Zap, Layers, AlertOctagon } from "lucide-react";
import { playSound } from "@/utils/audio";

interface Node {
  x: number;
  y: number;
  r: number;
  layer: number;
  pulse: number;
}

interface Connection {
  from: Node;
  to: Node;
  active: boolean;
  intensity: number;
}

interface Packet {
  x: number;
  y: number;
  targetNodeIndex: number;
  targetLayer: number;
  speed: number;
  type: "normal" | "ddos" | "sqli";
  progress: number; // 0 to 1
  size: number;
}

export default function AiEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSimulation, setActiveSimulation] = useState<"normal" | "ddos" | "sqli">("normal");
  const [riskScore, setRiskScore] = useState(12);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "SYS: AEGIS AI Engine active. Awaiting threat feeds.",
    "SYS: Model loaded (Weights: FP16, Latency: 15μs).",
    "SYS: Mode: Heuristic & Behavioral Analysis.",
  ]);

  const addLog = (log: string) => {
    setConsoleLogs((prev) => [log, ...prev.slice(0, 5)]);
  };

  const handleSimulate = (type: "normal" | "ddos" | "sqli") => {
    playSound("click");
    setActiveSimulation(type);
    
    if (type === "normal") {
      setRiskScore(8);
      addLog("USER: Injected normal TCP/IP packet burst.");
      setTimeout(() => {
        playSound("success");
        addLog("AI: Classification: CLEAN. Risk Score: 8%. Routing packet.");
      }, 800);
    } else if (type === "ddos") {
      setRiskScore(99);
      playSound("alert");
      addLog("USER: Simulated DDoS Storm Payload (50,000 req/sec).");
      setTimeout(() => {
        playSound("block");
        addLog("AI: CRITICAL: Packet rate threshold exceeded. Risk Score: 99%.");
        addLog("FIREWALL: Auto-isolated source IPs. Port throttling active.");
      }, 600);
    } else if (type === "sqli") {
      setRiskScore(87);
      playSound("alert");
      addLog("USER: Injected SQLi string: UNION SELECT username, password FROM users...");
      setTimeout(() => {
        playSound("block");
        addLog("AI: WARNING: Regex/Behavior mismatch (Entropy: 8.42). Risk Score: 87%.");
        addLog("FIREWALL: Filtered payload. Dropped connection.");
      }, 700);
    }
  };

  // Canvas Neural Network Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dimensions
    const width = (canvas.width = 650);
    const height = (canvas.height = 350);

    // Generate Network Layers
    const layers = [3, 4, 4, 2]; // 4 layers
    const nodes: Node[] = [];
    const layerSpacing = width / (layers.length - 0.7);

    layers.forEach((count, lIdx) => {
      const x = layerSpacing * (lIdx + 0.25);
      const verticalSpacing = height / (count + 1);
      for (let nIdx = 0; nIdx < count; nIdx++) {
        const y = verticalSpacing * (nIdx + 1);
        nodes.push({
          x,
          y,
          r: 7,
          layer: lIdx,
          pulse: 0,
        });
      }
    });

    // Make Connections
    const connections: Connection[] = [];
    nodes.forEach((node) => {
      nodes.forEach((target) => {
        if (target.layer === node.layer + 1) {
          connections.push({
            from: node,
            to: target,
            active: false,
            intensity: Math.random() * 0.4 + 0.2,
          });
        }
      });
    });

    const packets: Packet[] = [];
    let packetTimer = 0;

    // Animation Loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw connections
      connections.forEach((conn) => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);

        // Highlight connections if simulation matches
        let color = "rgba(0, 245, 255, 0.08)";
        if (activeSimulation === "ddos") {
          color = "rgba(255, 51, 102, 0.15)";
        } else if (activeSimulation === "sqli") {
          color = "rgba(255, 170, 0, 0.15)";
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = conn.intensity * (activeSimulation !== "normal" ? 2.5 : 1.2);
        ctx.stroke();
      });

      // 2. Draw nodes
      nodes.forEach((node) => {
        node.pulse += 0.05;
        const pulseRadius = node.r + Math.sin(node.pulse) * 2;

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);

        // Color nodes based on active state
        let fill = "rgba(10, 37, 64, 0.6)";
        let stroke = "rgba(0, 245, 255, 0.4)";
        let shadow = "rgba(0, 245, 255, 0.3)";

        if (activeSimulation === "ddos") {
          fill = "rgba(255, 51, 102, 0.15)";
          stroke = "rgba(255, 51, 102, 0.8)";
          shadow = "rgba(255, 51, 102, 0.5)";
        } else if (activeSimulation === "sqli") {
          fill = "rgba(255, 170, 0, 0.15)";
          stroke = "rgba(255, 170, 0, 0.8)";
          shadow = "rgba(255, 170, 0, 0.5)";
        } else if (node.layer === 3) {
          // Output nodes (Normal Allow vs Block)
          fill = "rgba(0, 214, 170, 0.1)";
          stroke = "rgba(0, 214, 170, 0.8)";
          shadow = "rgba(0, 214, 170, 0.5)";
        }

        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.shadowColor = shadow;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });

      // 3. Inject new packets periodically
      packetTimer++;
      const injectThreshold = activeSimulation === "ddos" ? 2 : 12;
      if (packetTimer >= injectThreshold) {
        packetTimer = 0;
        
        // Find input nodes (layer 0)
        const inputs = nodes.filter((n) => n.layer === 0);
        const randomInputIndex = Math.floor(Math.random() * inputs.length);
        const startNode = inputs[randomInputIndex];

        // Find initial targets (layer 1)
        const targets = nodes.filter((n) => n.layer === 1);
        const randomTargetIndex = Math.floor(Math.random() * targets.length);

        packets.push({
          x: startNode.x,
          y: startNode.y,
          targetNodeIndex: randomTargetIndex,
          targetLayer: 1,
          speed: activeSimulation === "ddos" ? 0.04 : 0.02,
          type: activeSimulation,
          progress: 0,
          size: activeSimulation === "sqli" ? 8 : Math.random() * 2 + 2,
        });
      }

      // 4. Update and Draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        // Find current layer and target layer nodes
        const currentLayerNodes = nodes.filter((n) => n.layer === p.targetLayer - 1);
        const startNode = currentLayerNodes[0]; // approximate starting coordinate
        const nextLayerNodes = nodes.filter((n) => n.layer === p.targetLayer);
        const targetNode = nextLayerNodes[p.targetNodeIndex];

        if (!targetNode || !startNode) {
          packets.splice(i, 1);
          continue;
        }

        // Interpolate position
        p.x = startNode.x + (targetNode.x - startNode.x) * p.progress;
        
        // Find matching connection to match packet y value
        p.y = startNode.y + (targetNode.y - startNode.y) * p.progress;

        // Draw packet
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        let pColor = "rgba(0, 245, 255, 0.9)";
        if (p.type === "ddos") {
          pColor = "rgba(255, 51, 102, 0.9)";
        } else if (p.type === "sqli") {
          pColor = "rgba(255, 170, 0, 0.9)";
        }
        ctx.fillStyle = pColor;
        ctx.shadowColor = pColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Check if destination node is reached
        if (p.progress >= 1.0) {
          // Route to next layer
          if (p.targetLayer < layers.length - 1) {
            p.targetLayer++;
            p.progress = 0;
            const nextLayerNodes = nodes.filter((n) => n.layer === p.targetLayer);
            p.targetNodeIndex = Math.floor(Math.random() * nextLayerNodes.length);
          } else {
            // Reached Output layer, remove packet
            packets.splice(i, 1);
          }
        }
      }

      // Draw Gate Barrier
      ctx.beginPath();
      ctx.moveTo(width - 90, 40);
      ctx.lineTo(width - 90, height - 40);
      ctx.strokeStyle = activeSimulation !== "normal" ? "rgba(255, 51, 102, 0.6)" : "rgba(0, 245, 255, 0.2)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw Labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "8px monospace";
      ctx.fillText("TRAFFIC", 10, 15);
      ctx.fillText("NEURAL ENGINE INFERENCE", width / 2.8, 15);
      ctx.fillText("GATEWAY", width - 130, 15);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeSimulation]);

  return (
    <section id="ai-engine" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        
        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Interactive Controls */}
          <div className="lg:col-span-5 space-y-8 font-mono">
            <div className="space-y-4">
              <span className="text-xs text-cyber-neon tracking-widest uppercase flex items-center space-x-1.5">
                <Layers className="w-4 h-4" />
                <span>Deep Packet Inspection Engine</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
                Behavioral AI Model Pipeline
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Packets are mapped into multi-dimensional vectors representing protocol features, latency intervals, entropy scales, and header flags. Our onboard neural network classifies intent within microseconds.
              </p>
            </div>

            {/* Simulated payload injector panel */}
            <div className="p-5 rounded-xl border border-cyber-neon/15 bg-cyber-blue/20 space-y-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-cyber-neon" />
                <span>Select Payload Stream</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleSimulate("normal")}
                  className={`py-2 rounded-lg border text-center text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeSimulation === "normal"
                      ? "border-cyber-emerald bg-cyber-emerald/10 text-cyber-emerald shadow-emerald/10"
                      : "border-gray-800 bg-cyber-dark text-gray-400 hover:border-cyber-neon/40 hover:text-white"
                  }`}
                >
                  TCP Normal
                </button>
                <button
                  onClick={() => handleSimulate("ddos")}
                  className={`py-2 rounded-lg border text-center text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeSimulation === "ddos"
                      ? "border-cyber-red bg-cyber-red/10 text-cyber-red shadow-red/10"
                      : "border-gray-800 bg-cyber-dark text-gray-400 hover:border-cyber-neon/40 hover:text-white"
                  }`}
                >
                  DDoS Storm
                </button>
                <button
                  onClick={() => handleSimulate("sqli")}
                  className={`py-2 rounded-lg border text-center text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeSimulation === "sqli"
                      ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-amber/10"
                      : "border-gray-800 bg-cyber-dark text-gray-400 hover:border-cyber-neon/40 hover:text-white"
                  }`}
                >
                  SQLi Injection
                </button>
              </div>

              {/* Dynamic Risk Gauge */}
              <div className="border-t border-cyber-neon/10 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">
                    AI Heuristic Classification
                  </div>
                  <div className="text-[10px] text-white font-bold uppercase mt-1">
                    {activeSimulation === "normal"
                      ? "CLEAN TRAFFIC"
                      : activeSimulation === "ddos"
                      ? "MALICIOUS DDoS FLOOD"
                      : "SQL INJECTION DETECTED"}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">
                    Risk Score
                  </div>
                  <div
                    className={`text-2xl font-bold tracking-widest text-glow ${
                      riskScore > 80
                        ? "text-cyber-red text-glow-red"
                        : riskScore > 40
                        ? "text-amber-500"
                        : "text-cyber-emerald text-glow-emerald"
                    }`}
                  >
                    {riskScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Live Terminal logs */}
            <div className="p-4 rounded-xl bg-cyber-dark/80 border border-gray-800 h-[120px] overflow-hidden flex flex-col justify-end space-y-1.5 text-[9px] text-gray-400">
              <div className="text-cyber-neon/60 uppercase tracking-widest font-bold border-b border-gray-800 pb-1 mb-1.5 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>INFERENCE CONSOLE</span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col-reverse space-y-reverse space-y-1 pr-1">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="truncate">
                    {log.startsWith("SYS:") && <span className="text-blue-400">{log}</span>}
                    {log.startsWith("USER:") && <span className="text-gray-300">{log}</span>}
                    {log.startsWith("AI:") && (
                      <span className={riskScore > 80 ? "text-cyber-red" : "text-cyber-emerald"}>
                        {log}
                      </span>
                    )}
                    {log.startsWith("FIREWALL:") && (
                      <span className="text-cyber-neon font-bold">{log}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Canvas Graphics Column */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full rounded-2xl glass-panel p-4 bg-cyber-blue/15 relative overflow-hidden flex flex-col justify-center items-center">
              <canvas ref={canvasRef} className="max-w-full block z-10" />

              {/* Scanline grid texture inside canvas glass-panel */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-0" />

              {/* Status footer inside visual panel */}
              <div className="w-full flex items-center justify-between mt-4 px-4 text-[9px] text-gray-500 font-mono border-t border-cyber-neon/10 pt-3 relative z-10">
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-cyber-emerald" />
                  <span>DEEP MODEL CLASSIFICATION ENABLED</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertOctagon className="w-3 h-3 text-cyber-neon animate-pulse" />
                  <span>THREAD RATE: 100% SECURE</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
