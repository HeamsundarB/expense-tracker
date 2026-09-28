"use client";

import React from "react";
import { Milestone, Award, Cpu, Blocks, Terminal } from "lucide-react";
import { playSound } from "@/utils/audio";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" rx="1" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface MilestoneItem {
  date: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const MILESTONES: MilestoneItem[] = [
  {
    date: "Nov 2024",
    title: "Problem Fracture & Analysis",
    desc: "Researched static ruleset bypass vectors, identifying core latency vulnerabilities in traditional NGFWs.",
    icon: <Terminal className="w-4 h-4 text-cyber-neon" />,
  },
  {
    date: "Jan 2025",
    title: "AI Inference Prototyping",
    desc: "Trained dynamic neural network models on CICIDS2017 cybersecurity datasets, optimizing model latency to 15μs.",
    icon: <Cpu className="w-4 h-4 text-cyber-neon" />,
  },
  {
    date: "Mar 2025",
    title: "Private Ledger Development",
    desc: "Integrated a lightweight hashing ledger to register and sign firewall rule updates and threat drops.",
    icon: <Blocks className="w-4 h-4 text-cyber-neon" />,
  },
  {
    date: "Aug 2025",
    title: "SIH Hackathon Finale (Rank 79)",
    desc: "Presented prototype to AICTE evaluators. Ranked 79th out of 500 teams in the national Software category.",
    icon: <Award className="w-4 h-4 text-cyber-emerald" />,
  },
];

interface Member {
  name: string;
  role: string;
  git: string;
  link: string;
}

const TEAM: Member[] = [
  { name: "Advait Nair", role: "Lead Systems Architect & AI", git: "https://github.com", link: "https://linkedin.com" },
  { name: "Rohan Sharma", role: "Blockchain Ledger Engineer", git: "https://github.com", link: "https://linkedin.com" },
  { name: "Diya Sen", role: "Network Security Researcher", git: "https://github.com", link: "https://linkedin.com" },
  { name: "Aarav Kapoor", role: "Full-Stack UI Developer", git: "https://github.com", link: "https://linkedin.com" },
];

export default function SihJourney() {
  return (
    <section id="sih-journey" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-cyber-neon flex items-center justify-center space-x-1.5">
            <Milestone className="w-4 h-4" />
            <span>Timeline and Roster</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
            Smart India Hackathon Journey
          </h2>
          <p className="text-gray-400 font-mono text-xs">
            From architecture design boards to the national evaluation stages. Introducing Team Rank 79/500 in Software, Blockchain & Cybersecurity.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start font-mono">
          
          {/* Vertical Timeline Left */}
          <div className="lg:col-span-6 space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-cyber-neon/15">
            {MILESTONES.map((ms, idx) => (
              <div
                key={idx}
                onMouseEnter={() => playSound("hover")}
                className="relative pl-14 group"
              >
                {/* Node Dot */}
                <div className="absolute left-[14px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyber-dark border-2 border-cyber-neon group-hover:border-cyber-emerald group-hover:scale-125 transition-all duration-350 z-10" />

                <div className="text-[10px] text-cyber-neon/60 group-hover:text-cyber-neon transition-colors duration-250 font-bold uppercase">
                  {ms.date}
                </div>
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-0.5">
                  {ms.title}
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-lg">
                  {ms.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Roster / Team Grid Right */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">
              Project Development Team
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM.map((member, index) => (
                <div
                  key={index}
                  onMouseEnter={() => playSound("hover")}
                  className="p-5 rounded-xl border border-cyber-neon/10 bg-cyber-blue/10 hover:border-cyber-neon/40 hover:bg-cyber-neon/5 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="space-y-3 relative z-10">
                    <div>
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider group-hover:text-cyber-neon transition-colors duration-300">
                        {member.name}
                      </h5>
                      <span className="text-[9px] text-gray-400 block mt-0.5">{member.role}</span>
                    </div>

                    <div className="flex space-x-2 pt-2 border-t border-gray-800/40">
                      <a
                        href={member.git}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playSound("click")}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={member.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playSound("click")}
                        className="text-gray-400 hover:text-cyber-neon p-1"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Scanline glitch effect on portrait card */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-cyber-neon/20 opacity-0 group-hover:opacity-100 group-hover:animate-glitch-scan pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
