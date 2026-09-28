"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Bot } from "lucide-react";
import { playSound } from "@/utils/audio";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

const PRESETS = [
  {
    q: "What is SIH25160?",
    a: "SIH25160 is our award-winning entry (ranked 79th out of 500 teams) for the Smart India Hackathon. It is an AI-Driven Next-Generation Firewall developed for dynamic threat detection and Zero Trust implementation in enterprise networks.",
  },
  {
    q: "How does the AI Firewall work?",
    a: "The core engine runs a real-time behavioral analytics module. It inspects packet headers and payload entropy to evaluate threat scores. If the risk exceeds threshold, it drops packets in 15 microseconds, generating adaptive firewall rules.",
  },
  {
    q: "How is Blockchain used?",
    a: "We utilize a lightweight private blockchain ledger. All firewall traffic logs, rule updates, and threat remediation logs are cryptographically hashed and chained. This ensures tamper-proof audit trails for forensic security audits.",
  },
  {
    q: "What is Zero Trust here?",
    a: "Our Zero Trust model enforces 'never trust, always verify'. It involves continuous identity validation, device posture scoring, and micro-segmentation. Access is dynamically restricted at the application/resource boundary.",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Aegis AI Assistant online. How can I assist you with the Next-Gen Zero Trust Firewall architecture?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleToggle = () => {
    playSound("click");
    setIsOpen(!isOpen);
  };

  const handleAskPreset = (question: string, answer: string) => {
    playSound("click");
    
    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setTyping(false);
      playSound("success");
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-mono text-xs">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          onMouseEnter={() => playSound("hover")}
          className="flex items-center justify-center w-14 h-14 rounded-full border border-cyber-neon/40 bg-cyber-dark text-cyber-neon hover:text-white hover:border-cyber-neon hover:shadow-neon transition-all duration-300 shadow-lg cursor-pointer group"
        >
          <MessageSquare className="w-6 h-6 animate-pulse group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] rounded-2xl glass-panel flex flex-col overflow-hidden animate-fade-in border border-cyber-neon/30">
          {/* Header */}
          <div className="px-4 py-3 bg-cyber-blue/60 border-b border-cyber-neon/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg border border-cyber-neon bg-cyber-neon/10 flex items-center justify-center text-cyber-neon shadow-neon/10">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wide">AEGIS CORE AI</div>
                <div className="text-[9px] text-cyber-emerald flex items-center space-x-1">
                  <span className="w-1 h-1 rounded-full bg-cyber-emerald animate-ping" />
                  <span>ANALYSIS AGENT</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="text-gray-400 hover:text-cyber-neon p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages body */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-cyber-dark/40"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 border ${
                    msg.sender === "user"
                      ? "bg-cyber-neon/10 border-cyber-neon/30 text-white rounded-tr-none"
                      : "bg-cyber-blue/20 border-cyber-neon/15 text-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[8px] text-gray-500 block text-right mt-1.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-cyber-blue/20 border border-cyber-neon/15 text-gray-400 rounded-xl rounded-tl-none p-3 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Presets Grid */}
          <div className="p-3 border-t border-cyber-neon/10 bg-cyber-dark/70 space-y-1.5">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest px-1">
              Select Query Stream:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleAskPreset(preset.q, preset.a)}
                  className="p-2 rounded text-left border border-cyber-neon/10 bg-cyber-blue/20 text-gray-300 hover:border-cyber-neon/40 hover:bg-cyber-neon/5 transition-all text-[10px] truncate cursor-pointer"
                >
                  {preset.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
