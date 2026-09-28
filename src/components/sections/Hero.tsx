"use client";

import React, { useEffect, useRef, useState } from "react";
import { Shield, Activity, ArrowRight } from "lucide-react";
import { playSound } from "@/utils/audio";
import { motion } from "framer-motion";

// Custom WebGL Shaders for high-performance fluid particles
const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_type; // 0 = normal, 1 = threat, 2 = neutralized
  varying float v_type;
  uniform vec2 u_resolution;

  void main() {
    // Convert pixels to 0.0 to 1.0, then to clipspace -1.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    
    // Invert Y for standard WebGL coordinate system
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    gl_PointSize = a_size;
    v_type = a_type;
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying float v_type;

  void main() {
    // Render particle as circular glow
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (dist > 0.5) {
      discard;
    }
    
    float alpha = 1.0 - (dist * 2.0); // Soft edge glow
    
    // Colors: normal (cyan/neon), threat (neon-red), neutralized (emerald)
    vec3 color;
    if (v_type == 0.0) {
      color = vec3(0.0, 0.96, 1.0); // Cyan #00F5FF
    } else if (v_type == 1.0) {
      color = vec3(1.0, 0.2, 0.4);  // Red #FF3366
    } else {
      color = vec3(0.0, 0.83, 0.67); // Emerald #00D4AA
    }
    
    gl_FragColor = vec4(color, alpha * 0.8);
  }
`;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  type: number; // 0=normal, 1=threat, 2=neutralized
  timer: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [threatCount, setThreatCount] = useState(4125092);

  // Live Threat Counter Odometer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // WebGL Fluid Particle Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) {
      console.warn("WebGL not supported, skipping shader fluid simulation.");
      return;
    }

    // Set blend mode for transparent glowing particles
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // Compile Shaders Helper
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(VERTEX_SHADER_SRC, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SRC, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Get Attribute / Uniform locations
    const positionAttrLoc = gl.getAttribLocation(program, "a_position");
    const sizeAttrLoc = gl.getAttribLocation(program, "a_size");
    const typeAttrLoc = gl.getAttribLocation(program, "a_type");
    const resolutionUnifLoc = gl.getUniformLocation(program, "u_resolution");

    // Initialize Particles
    const particles: Particle[] = [];
    const particleCount = 1500;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 0.8 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 4 + 2,
        baseSize: Math.random() * 4 + 2,
        type: 0,
        timer: 0,
      });
    }

    // Mouse interactions
    const mouse = { x: -1000, y: -1000, rx: -1000, ry: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);

    // Dynamic Attack Generator (Clusters and red shifts)
    let attackActive = false;
    let attackTimer = 0;
    let attackX = width / 2;
    let attackY = height / 2;

    const triggerAttack = () => {
      attackActive = true;
      attackTimer = 200; // frames
      attackX = Math.random() * (width - 200) + 100;
      attackY = Math.random() * (height - 200) + 100;
      playSound("alert");
    };

    // Trigger initial attack in 4 seconds
    let attackTriggerTimeout = setTimeout(triggerAttack, 4000);

    // Set up Buffers
    const positionBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();
    const typeBuffer = gl.createBuffer();

    let animationId: number;

    const render = () => {
      if (!canvas) return;
      
      const w = canvas.width;
      const h = canvas.height;

      // Update attack states
      if (attackActive) {
        attackTimer--;
        if (attackTimer <= 0) {
          attackActive = false;
          // Trigger next attack in 10-15 seconds
          attackTriggerTimeout = setTimeout(triggerAttack, 10000 + Math.random() * 5000);
        }
      }

      // Update Particles
      const positions = new Float32Array(particleCount * 2);
      const sizes = new Float32Array(particleCount);
      const types = new Float32Array(particleCount);

      // Mouse easing
      mouse.rx += (mouse.x - mouse.rx) * 0.1;
      mouse.ry += (mouse.y - mouse.ry) * 0.1;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Threat simulation
        if (attackActive && p.type === 0 && Math.random() < 0.05) {
          const dx = p.x - attackX;
          const dy = p.y - attackY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            p.type = 1; // turn into threat (red)
            p.timer = 120; // stay red for 120 frames
          }
        }

        if (p.type === 1) {
          p.timer--;
          if (p.timer <= 0) {
            p.type = 2; // turn to neutralized (emerald)
            p.timer = 80; // stay emerald for 80 frames
          }
          // Pull threats toward the attack center (clustering)
          const dx = attackX - p.x;
          const dy = attackY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 10) {
            p.vx += (dx / dist) * 0.15;
            p.vy += (dy / dist) * 0.15;
          }
        } else if (p.type === 2) {
          p.timer--;
          if (p.timer <= 0) {
            p.type = 0; // return to normal (cyan)
          }
        }

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.rx;
          const dy = p.y - mouse.ry;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 3;
          }
        }

        // Boundary checks with wraps
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Speed limiters
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = p.type === 1 ? 3 : 1.2;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Pulse size slightly based on type
        p.size = p.baseSize + (p.type === 1 ? Math.sin(Date.now() * 0.05) * 3 : 0);

        // Put in WebGL typed arrays
        positions[i * 2] = p.x;
        positions[i * 2 + 1] = p.y;
        sizes[i] = p.size;
        types[i] = p.type;
      }

      // Draw in WebGL
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(resolutionUnifLoc, w, h);

      // Positions Buffer Bind
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(positionAttrLoc);
      gl.vertexAttribPointer(positionAttrLoc, 2, gl.FLOAT, false, 0, 0);

      // Sizes Buffer Bind
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(sizeAttrLoc);
      gl.vertexAttribPointer(sizeAttrLoc, 1, gl.FLOAT, false, 0, 0);

      // Types Buffer Bind
      gl.bindBuffer(gl.ARRAY_BUFFER, typeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, types, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(typeAttrLoc);
      gl.vertexAttribPointer(typeAttrLoc, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, particleCount);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(attackTriggerTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(sizeBuffer);
      gl.deleteBuffer(typeBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-cyber-dark overflow-hidden pt-20"
    >
      {/* WebGL Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-60" />

      {/* Decorative radial overlay to dark edges */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none z-10" />

      {/* Overlay grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyber-neon/30 bg-cyber-blue/30 text-cyber-neon font-mono text-[10px] uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5" />
              <span>AICTE SPONSORED PROJECT • SIH25160</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-cyber tracking-tight text-white leading-tight">
              AI-Driven <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-emerald text-glow">
                Next-Gen Firewall
              </span>
            </h1>

            <p className="text-gray-400 font-mono text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Enforcing zero-trust network integrity with low-latency AI heuristic model inference.
              Dynamic deep packet inspection and blockchain log immutability.
            </p>
          </motion.div>

          {/* Odometer & Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 font-mono"
          >
            <div className="p-4 rounded-xl glass-panel bg-cyber-blue/20">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 flex items-center space-x-1 justify-center lg:justify-start">
                <Activity className="w-3 h-3 text-cyber-neon" />
                <span>Threats Neut.</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-widest text-glow">
                {threatCount.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel bg-cyber-blue/20">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 flex items-center space-x-1 justify-center lg:justify-start">
                <Shield className="w-3 h-3 text-cyber-emerald" />
                <span>SIH Team Rank</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-cyber-emerald tracking-widest text-glow-emerald">
                79<span className="text-xs text-gray-400 font-normal">/500</span>
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel bg-cyber-blue/20 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 justify-center lg:justify-start">
                Latency
              </div>
              <div className="text-xl sm:text-2xl font-bold text-cyber-neon tracking-widest">
                15<span className="text-xs font-normal">μs</span>
              </div>
            </div>
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 font-mono"
          >
            <a
              href="#demo"
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className="w-full sm:w-auto px-8 py-3 rounded-lg border border-cyber-neon bg-cyber-neon text-cyber-dark hover:bg-transparent hover:text-cyber-neon font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-neon flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Initialize Protocol</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            
            <a
              href="#threat-map"
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className="w-full sm:w-auto px-8 py-3 rounded-lg border border-cyber-neon/30 bg-cyber-blue/20 text-cyber-neon hover:border-cyber-neon hover:bg-cyber-neon/5 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Threat Intel Map</span>
            </a>
          </motion.div>
        </div>

        {/* Right HUD Graphics Column */}
        <div className="lg:col-span-5 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full aspect-square rounded-2xl glass-panel relative flex items-center justify-center p-8 bg-cyber-blue/10"
          >
            {/* Pulsing circular HUD rings */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-cyber-neon/15 animate-spin [animation-duration:40s]" />
            <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-cyber-emerald/15 animate-spin [animation-duration:25s]" />
            <div className="absolute w-[40%] h-[40%] rounded-full border border-double border-cyber-neon/10 animate-pulse" />

            <div className="relative text-center z-10 space-y-4 font-mono select-none">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl border border-cyber-neon/40 bg-cyber-blue/40 flex items-center justify-center text-cyber-neon shadow-neon/10 animate-neon-pulse">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <div>
                <div className="text-white text-xs font-bold tracking-widest uppercase">
                  AEGIS CORE ACTIVE
                </div>
                <div className="text-cyber-neon text-[9px] tracking-tight mt-1 animate-pulse">
                  MEM_ADDR: 0x8F32C01A
                </div>
              </div>
              <div className="flex justify-center space-x-3 text-[10px] text-gray-500 border-t border-cyber-neon/10 pt-3">
                <div>
                  LOGS: <span className="text-cyber-emerald">SECURE</span>
                </div>
                <div>•</div>
                <div>
                  INTEGRITY: <span className="text-cyber-neon">100%</span>
                </div>
              </div>
            </div>

            {/* Custom Scan Line Overlay */}
            <div className="scan-line" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
