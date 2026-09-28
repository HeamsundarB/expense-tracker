"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe as GlobeIcon, ShieldAlert, Cpu } from "lucide-react";
import { playSound } from "@/utils/audio";
import * as THREE from "three";

interface ThreatLog {
  id: string;
  time: string;
  source: string;
  sourceIp: string;
  target: string;
  type: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  latency: string;
  latLng: { src: [number, number]; dst: [number, number] };
}

const INITIAL_LOGS: ThreatLog[] = [
  {
    id: "1",
    time: "10:52:01",
    source: "Shenzhen, CN",
    sourceIp: "103.45.2.109",
    target: "US East (DC)",
    type: "DDoS Flood (SYN)",
    severity: "CRITICAL",
    latency: "15μs",
    latLng: { src: [22.54, 114.05], dst: [38.90, -77.03] },
  },
  {
    id: "2",
    time: "10:52:03",
    source: "St Petersburg, RU",
    sourceIp: "82.112.98.54",
    target: "EU West (Frankfurt)",
    type: "Brute Force (SSH)",
    severity: "WARNING",
    latency: "14μs",
    latLng: { src: [59.93, 30.33], dst: [50.11, 8.68] },
  },
  {
    id: "3",
    time: "10:52:05",
    source: "Pyongyang, KP",
    sourceIp: "175.45.176.8",
    target: "AP East (Tokyo)",
    type: "SQL Injection",
    severity: "CRITICAL",
    latLng: { src: [39.03, 125.76], dst: [35.67, 139.65] },
    latency: "16μs",
  },
];

export default function ThreatIntelGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<ThreatLog[]>(INITIAL_LOGS);

  // Convert Lat/Lng to Cartesian 3D Sphere Coordinates
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.sin(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    return new THREE.Vector3(x, y, z);
  };

  // Add real-time log updates
  useEffect(() => {
    const countries = [
      { name: "São Paulo, BR", ip: "191.242.12.8", latLng: [-23.55, -46.63] },
      { name: "Kiev, UA", ip: "91.200.32.14", latLng: [50.45, 30.52] },
      { name: "Tehran, IR", ip: "185.120.4.99", latLng: [35.68, 51.38] },
      { name: "Amsterdam, NL", ip: "46.144.18.23", latLng: [52.36, 4.90] },
      { name: "Singapore, SG", ip: "103.22.200.41", latLng: [1.35, 103.82] },
      { name: "Mumbai, IN", ip: "122.160.10.150", latLng: [19.07, 72.87] },
    ];
    const targets = [
      { name: "US East (DC)", latLng: [38.90, -77.03] },
      { name: "EU West (Frankfurt)", latLng: [50.11, 8.68] },
      { name: "AP East (Tokyo)", latLng: [35.67, 139.65] },
      { name: "IN Central (Bangalore)", latLng: [12.97, 77.59] },
    ];
    const types = ["Port Scan (TCP/UDP)", "SQL Injection", "DDoS Flood (UDP)", "Directory Traversal", "Ransomware Exploit"];
    const severities = ["CRITICAL", "WARNING", "INFO"] as const;

    const interval = setInterval(() => {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const target = targets[Math.floor(Math.random() * targets.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];

      const newLog: ThreatLog = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString([], { hour12: false }),
        source: country.name,
        sourceIp: country.ip,
        target: target.name,
        type,
        severity,
        latency: `${Math.floor(Math.random() * 5) + 12}μs`,
        latLng: { src: country.latLng as [number, number], dst: target.latLng as [number, number] },
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
      
      // Dispatch threat trigger event to let globe spawn new attack arc
      const event = new CustomEvent("threat-added", { detail: newLog });
      window.dispatchEvent(event);

      // Play cyber alarm if critical
      if (severity === "CRITICAL") {
        playSound("alert");
      } else {
        playSound("hover");
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Three.js Render Code
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight || 450;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Build Globe Wireframe Mesh
    const radius = 4.5;
    const segments = 24;
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    
    // Custom Wireframe glowing Material
    const material = new THREE.MeshBasicMaterial({
      color: 0x00d4aa, // neon emerald
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Outer atmosphere shell glow
    const atmosGeom = new THREE.SphereGeometry(radius + 0.1, 16, 16);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff, // neon cyan
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const atmosphere = new THREE.Mesh(atmosGeom, atmosMat);
    scene.add(atmosphere);

    // Add glowing coordinate points for major cities/targets
    const pointsGroup = new THREE.Group();
    scene.add(pointsGroup);

    const locations = [
      [38.90, -77.03], // DC
      [50.11, 8.68],   // Frankfurt
      [35.67, 139.65], // Tokyo
      [12.97, 77.59],  // Bangalore
      [22.54, 114.05], // Shenzhen
      [59.93, 30.33],  // St Petersburg
    ];

    locations.forEach(([lat, lng]) => {
      const pos = latLngToVector3(lat, lng, radius);
      const pointGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const pointMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.8,
      });
      const pointMesh = new THREE.Mesh(pointGeom, pointMat);
      pointMesh.position.copy(pos);
      pointsGroup.add(pointMesh);
    });

    // 3. Dynamic Bezier Threat Arcs Group
    const arcsGroup = new THREE.Group();
    scene.add(arcsGroup);

    interface ActiveArc {
      curve: THREE.QuadraticBezierCurve3;
      line: THREE.Line;
      packet: THREE.Mesh;
      progress: number;
      speed: number;
    }
    const activeArcs: ActiveArc[] = [];

    const createAttackArc = (src: [number, number], dst: [number, number], severity: string) => {
      const start = latLngToVector3(src[0], src[1], radius);
      const end = latLngToVector3(dst[0], dst[1], radius);

      // Determine control point arched above the globe surface
      const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      const heightMultiplier = Math.max(1.2, distance * 0.35);
      const controlPoint = midPoint.normalize().multiplyScalar(radius + heightMultiplier);

      const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
      const points = curve.getPoints(30);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

      // Color scheme based on severity
      const color = severity === "CRITICAL" ? 0xff3366 : severity === "WARNING" ? 0xffaa00 : 0x00f5ff;

      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      arcsGroup.add(line);

      // Traveling packet mesh
      const packetGeom = new THREE.SphereGeometry(0.06, 6, 6);
      const packetMat = new THREE.MeshBasicMaterial({ color });
      const packet = new THREE.Mesh(packetGeom, packetMat);
      packet.position.copy(start);
      arcsGroup.add(packet);

      activeArcs.push({
        curve,
        line,
        packet,
        progress: 0,
        speed: 0.015 + Math.random() * 0.01,
      });
    };

    // Listen to incoming live threat updates
    const handleNewThreat = (e: Event) => {
      const customEvent = e as CustomEvent<ThreatLog>;
      const log = customEvent.detail;
      createAttackArc(log.latLng.src, log.latLng.dst, log.severity);
    };

    window.addEventListener("threat-added", handleNewThreat);

    // Seed initial attack arcs
    INITIAL_LOGS.forEach((log) => {
      createAttackArc(log.latLng.src, log.latLng.dst, log.severity);
    });

    // 4. Mouse Rotation Interactions
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = () => { isDragging = true; };
    const handleMouseUp = () => { isDragging = false; };
    const handleMouseMove = (e: MouseEvent) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      if (isDragging) {
        globe.rotation.y += deltaMove.x * 0.005;
        globe.rotation.x += deltaMove.y * 0.005;
        atmosphere.rotation.y += deltaMove.x * 0.005;
        atmosphere.rotation.x += deltaMove.y * 0.005;
        pointsGroup.rotation.y += deltaMove.x * 0.005;
        pointsGroup.rotation.x += deltaMove.y * 0.005;
        arcsGroup.rotation.y += deltaMove.x * 0.005;
        arcsGroup.rotation.x += deltaMove.y * 0.005;
      }

      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener("mousedown", handleMouseDown);
    canvasEl.addEventListener("mouseup", handleMouseUp);
    canvasEl.addEventListener("mousemove", handleMouseMove);

    // 5. Animation Render Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animateScene = () => {
      // Auto rotate slightly when not dragging
      if (!isDragging) {
        const delta = clock.getDelta() * 0.08;
        globe.rotation.y += delta;
        atmosphere.rotation.y += delta;
        pointsGroup.rotation.y += delta;
        arcsGroup.rotation.y += delta;
      }

      // Update attack packets progress
      for (let i = activeArcs.length - 1; i >= 0; i--) {
        const arc = activeArcs[i];
        arc.progress += arc.speed;
        
        if (arc.progress >= 1.0) {
          // Packet finished journey, clean up
          arcsGroup.remove(arc.line);
          arcsGroup.remove(arc.packet);
          arc.line.geometry.dispose();
          (arc.line.material as THREE.Material).dispose();
          arc.packet.geometry.dispose();
          (arc.packet.material as THREE.Material).dispose();
          activeArcs.splice(i, 1);
        } else {
          // Move packet mesh along Bezier curve path
          const pos = arc.curve.getPointAt(arc.progress);
          arc.packet.position.copy(pos);
        }
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animateScene);
    };

    animateScene();

    // 6. Handle Container Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height || 450;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("threat-added", handleNewThreat);
      canvasEl.removeEventListener("mousedown", handleMouseDown);
      canvasEl.removeEventListener("mouseup", handleMouseUp);
      canvasEl.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      
      // Memory cleanup
      geometry.dispose();
      material.dispose();
      atmosGeom.dispose();
      atmosMat.dispose();
      
      // Clean remaining active curves
      activeArcs.forEach((arc) => {
        arcsGroup.remove(arc.line);
        arcsGroup.remove(arc.packet);
        arc.line.geometry.dispose();
        (arc.line.material as THREE.Material).dispose();
        arc.packet.geometry.dispose();
        (arc.packet.material as THREE.Material).dispose();
      });
      
      scene.remove(globe);
      scene.remove(atmosphere);
      scene.remove(pointsGroup);
      scene.remove(arcsGroup);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="threat-map" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: ThreeJS Scene */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="w-full h-[450px] rounded-2xl glass-panel bg-cyber-blue/10 relative overflow-hidden flex items-center justify-center">
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
              
              {/* Globe controls overlay UI */}
              <div className="absolute top-4 left-4 p-3 rounded-lg border border-cyber-neon/10 bg-cyber-dark/80 font-mono text-[9px] text-gray-400 space-y-1 z-10 pointer-events-none">
                <div className="flex items-center space-x-1.5 text-cyber-neon font-bold">
                  <GlobeIcon className="w-3.5 h-3.5" />
                  <span>3D GLOBAL MAP INTERACTIVE</span>
                </div>
                <div>CLICK + DRAG TO ROTATE GLOBE</div>
                <div>LIVE DATA INTERVAL: 4.5S</div>
              </div>

              {/* HUD compass rose coordinates */}
              <div className="absolute bottom-4 right-4 text-[9px] text-gray-500 font-mono pointer-events-none text-right">
                <div>COORD: R_3D_SPHERE_4.5</div>
                <div>GRID: 24x24 INTERRUPT</div>
              </div>
            </div>
          </div>

          {/* Right Side: Live Threat Logs */}
          <div className="lg:col-span-5 space-y-8 font-mono">
            <div className="space-y-4">
              <span className="text-xs text-cyber-neon tracking-widest uppercase flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Dynamic Threat Intelligence Feed</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
                Live Attack Origin Mapping
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Aggregating real-time telemetry from honeypots and distributed endpoints. Every signature is categorized and mapped to coordinates before gateway rejection.
              </p>
            </div>

            {/* Logs console */}
            <div className="p-4 rounded-xl border border-cyber-neon/15 bg-cyber-blue/20 flex flex-col h-[320px] overflow-hidden">
              <div className="text-[10px] text-cyber-neon/60 uppercase font-bold border-b border-gray-800 pb-2 mb-3 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyber-neon animate-pulse" />
                <span>INTELLIGENCE CAPTURE LOGS</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded border text-[10px] flex flex-col space-y-1.5 transition-all duration-300 ${
                      log.severity === "CRITICAL"
                        ? "border-cyber-red/30 bg-cyber-red/5"
                        : log.severity === "WARNING"
                        ? "border-amber-500/20 bg-amber-500/5"
                        : "border-cyber-neon/10 bg-cyber-blue/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-500">{log.time} UTC</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          log.severity === "CRITICAL"
                            ? "bg-cyber-red/10 text-cyber-red border border-cyber-red/30"
                            : log.severity === "WARNING"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                            : "bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </div>

                    <div className="text-gray-200">
                      <span className="text-cyber-neon font-bold">{log.sourceIp}</span> ({log.source}) ➔{" "}
                      <span className="text-white font-bold">{log.target}</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-gray-400">
                      <span>TYPE: {log.type}</span>
                      <span className="text-cyber-emerald font-bold">BLOCKED ({log.latency})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
