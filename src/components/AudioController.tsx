"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toggleAudio, playSound } from "@/utils/audio";

export default function AudioController() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEnabled(!!(window as Window & { cyberAudioEnabled?: boolean }).cyberAudioEnabled);
    }
  }, []);

  const handleToggle = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    toggleAudio(nextState);
    if (nextState) {
      // Small delay to allow the AudioContext to warm up
      setTimeout(() => playSound("success"), 50);
    }
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => playSound("hover")}
      className="flex items-center justify-center p-2 rounded-lg border border-cyber-neon/20 bg-cyber-blue/40 text-cyber-neon backdrop-blur hover:border-cyber-neon/50 hover:bg-cyber-neon/10 transition-all duration-300 shadow-neon/5 hover:shadow-neon/20 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyber-neon/50"
      title={enabled ? "Mute Sound Effects" : "Enable Generative Audio"}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4 animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4 text-gray-500 hover:text-cyber-neon" />
      )}
      <span className="sr-only">Toggle Audio</span>
    </button>
  );
}
