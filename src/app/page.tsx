import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import ProblemFracture from "@/components/sections/ProblemFracture";
import AiEngine from "@/components/sections/AiEngine";
import ZeroTrust from "@/components/sections/ZeroTrust";
import ThreatIntelGlobe from "@/components/sections/ThreatIntelGlobe";
import CompetitiveMatrix from "@/components/sections/CompetitiveMatrix";
import SihJourney from "@/components/sections/SihJourney";
import TechnicalSpecs from "@/components/sections/TechnicalSpecs";
import LiveDemoPortal from "@/components/sections/LiveDemoPortal";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="bg-cyber-dark text-gray-100 min-h-screen relative selection:bg-cyber-neon selection:text-cyber-dark">
      {/* Fixed Navigation Header */}
      <Navbar />

      {/* Sections single scroll workflow */}
      <main>
        <Hero />
        <ThreatIntelGlobe />
        <ProblemFracture />
        <AiEngine />
        <ZeroTrust />
        <CompetitiveMatrix />
        <LiveDemoPortal />
        <TechnicalSpecs />
        <SihJourney />
        <Contact />
      </main>

      {/* Central Institutional Footer */}
      <Footer />

      {/* Floating Interactive AI Assistant */}
      <Chatbot />
    </div>
  );
}

