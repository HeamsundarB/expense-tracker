"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Eye, ShieldAlert, ToggleLeft, ToggleRight, ShieldCheck } from "lucide-react";
import { playSound } from "@/utils/audio";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Alert {
  id: string;
  source: string;
  type: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "ACTIVE" | "MITIGATED";
}

interface ChartData {
  time: string;
  packets: number;
}

export default function LiveDemoPortal() {
  const [role, setRole] = useState<"Admin" | "Analyst">("Admin");
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [sslInspect, setSslInspect] = useState(false);
  const [portBlock, setPortBlock] = useState(true);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "a1", source: "108.162.24.90", type: "SQLi Probe", severity: "CRITICAL", status: "ACTIVE" },
    { id: "a2", source: "185.120.4.99", type: "SSH brute-force", severity: "WARNING", status: "ACTIVE" },
    { id: "a3", source: "46.144.18.23", type: "Port scan", severity: "INFO", status: "ACTIVE" },
  ]);

  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Seed chart data and simulate updates
  useEffect(() => {
    // Generate initial 7 data points
    const data: ChartData[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5000);
      data.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        packets: Math.floor(Math.random() * 300) + 400,
      });
    }
    setChartData(data);

    const interval = setInterval(() => {
      setChartData((prev) => {
        const nextData = [...prev.slice(1)];
        const time = new Date();
        nextData.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          packets: Math.floor(Math.random() * 300) + 400,
        });
        return nextData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRoleToggle = () => {
    playSound("click");
    setRole((prev) => (prev === "Admin" ? "Analyst" : "Admin"));
  };

  const handleMitigate = (id: string) => {
    playSound("success");
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status: "MITIGATED" } : alert))
    );
  };

  const handleRuleToggle = (rule: "quarantine" | "ssl" | "port") => {
    if (role !== "Admin") {
      playSound("block");
      return;
    }

    playSound("click");
    if (rule === "quarantine") setAutoQuarantine(!autoQuarantine);
    if (rule === "ssl") setSslInspect(!sslInspect);
    if (rule === "port") setPortBlock(!portBlock);

    // Generate mock blockchain hash for rule updates
    const mockHash = "0x" + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    
    setTxHash(mockHash);
    setTimeout(() => {
      playSound("success");
    }, 200);
  };

  return (
    <section id="demo" className="relative min-h-screen bg-cyber-dark py-24 border-t border-cyber-neon/10 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full font-mono text-xs">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs text-cyber-neon tracking-widest uppercase flex items-center justify-center space-x-1.5">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span>Interactive Platform Console</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-cyber text-white">
            AEGIS Command Center UI
          </h2>
          <p className="text-gray-400 text-xs">
            Interact with active rules, mitigate system breaches, and toggle credential modes.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Metrics & Chart */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Chart Panel */}
            <div className="p-6 rounded-xl glass-panel bg-cyber-blue/10 border border-cyber-neon/10 flex flex-col justify-between h-[320px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-ping" />
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Live Packet Flow RATE (PPS)</span>
                </div>
                <div className="text-[10px] text-gray-500">SAMPLING: 5.0S INTERVAL</div>
              </div>

              {/* Responsive Container */}
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#4b5563" fontSize={8} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={8} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#050B14", borderColor: "rgba(0, 245, 255, 0.2)" }}
                      labelStyle={{ color: "#fff", fontSize: 9 }}
                      itemStyle={{ color: "#00F5FF", fontSize: 9 }}
                    />
                    <Area type="monotone" dataKey="packets" stroke="#00F5FF" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPackets)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Metrics Dials */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-gray-800 bg-cyber-dark/40">
                <div className="text-gray-500 text-[9px] uppercase tracking-wider mb-1">CPU Load</div>
                <div className="text-white text-md font-bold">12.4%</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-800 bg-cyber-dark/40">
                <div className="text-gray-500 text-[9px] uppercase tracking-wider mb-1">Memory Allocation</div>
                <div className="text-white text-md font-bold">88.5 MB</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-800 bg-cyber-dark/40">
                <div className="text-gray-500 text-[9px] uppercase tracking-wider mb-1">Rule Count</div>
                <div className="text-white text-md font-bold">142 Active</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-800 bg-cyber-dark/40">
                <div className="text-gray-500 text-[9px] uppercase tracking-wider mb-1">NIC Line Rate</div>
                <div className="text-cyber-emerald text-md font-bold text-glow-emerald">10.0 Gbps</div>
              </div>
            </div>

          </div>

          {/* Right Column: Policies & Actions */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            
            {/* Control Panel */}
            <div className="p-6 rounded-xl glass-panel bg-cyber-blue/15 border border-cyber-neon/10 space-y-6">
              
              {/* Role Toggle & Header */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">Firewall Policies</h4>
                  <span className="text-[9px] text-gray-500">ROLE: {role.toUpperCase()}</span>
                </div>
                <button
                  onClick={handleRoleToggle}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded border border-cyber-neon/20 bg-cyber-blue/30 text-cyber-neon hover:bg-cyber-neon/5 transition-all cursor-pointer text-[9px]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Toggle Role</span>
                </button>
              </div>

              {/* Action Rules Stack */}
              <div className="space-y-4">
                
                {/* Rule 1 */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-[11px] font-bold">Auto-Quarantine Hosts</div>
                    <p className="text-[9px] text-gray-500">Isolate high risk IPs</p>
                  </div>
                  <button
                    onClick={() => handleRuleToggle("quarantine")}
                    disabled={role !== "Admin"}
                    className={`cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      autoQuarantine ? "text-cyber-neon" : "text-gray-600"
                    }`}
                  >
                    {autoQuarantine ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>

                {/* Rule 2 */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-[11px] font-bold">Dynamic SSL Inspection</div>
                    <p className="text-[9px] text-gray-500">Decrypt packets for analysis</p>
                  </div>
                  <button
                    onClick={() => handleRuleToggle("ssl")}
                    disabled={role !== "Admin"}
                    className={`cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      sslInspect ? "text-cyber-neon" : "text-gray-600"
                    }`}
                  >
                    {sslInspect ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>

                {/* Rule 3 */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-[11px] font-bold">Throttling Port 22</div>
                    <p className="text-[9px] text-gray-500">Drop excessive SSH connections</p>
                  </div>
                  <button
                    onClick={() => handleRuleToggle("port")}
                    disabled={role !== "Admin"}
                    className={`cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      portBlock ? "text-cyber-neon" : "text-gray-600"
                    }`}
                  >
                    {portBlock ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>

              </div>

              {/* Blockchain signature Hash */}
              {txHash && (
                <div className="p-3 rounded-lg bg-cyber-emerald/5 border border-cyber-emerald/20 space-y-1">
                  <div className="flex items-center justify-between text-[8px] text-cyber-emerald font-bold">
                    <div className="flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>LEDGER LOG RECORDED</span>
                    </div>
                    <span>CONFIRMED</span>
                  </div>
                  <div className="text-[8px] text-gray-500 font-mono break-all leading-tight">
                    TX: {txHash}
                  </div>
                </div>
              )}
            </div>

            {/* Active Alerts Remediation */}
            <div className="p-5 rounded-xl border border-gray-800 bg-cyber-dark/40 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1.5 text-cyber-red/80 font-bold uppercase tracking-wider mb-3">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                  <span>Threat Remediations</span>
                </div>
                
                <div className="space-y-2.5">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-2.5 rounded border border-gray-800 bg-cyber-dark/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-bold text-white flex items-center space-x-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              alert.severity === "CRITICAL"
                                ? "bg-cyber-red"
                                : alert.severity === "WARNING"
                                ? "bg-amber-500"
                                : "bg-blue-400"
                            }`}
                          />
                          <span>{alert.type}</span>
                        </div>
                        <div className="text-[8px] text-gray-500 mt-0.5">SRC: {alert.source}</div>
                      </div>
                      
                      <div>
                        {alert.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleMitigate(alert.id)}
                            className="px-2 py-1 border border-cyber-neon/30 bg-cyber-blue/30 text-cyber-neon hover:border-cyber-neon hover:bg-cyber-neon/10 transition-all rounded text-[8px] cursor-pointer"
                          >
                            Mitigate
                          </button>
                        ) : (
                          <span className="text-[8px] text-cyber-emerald font-bold">MITIGATED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
