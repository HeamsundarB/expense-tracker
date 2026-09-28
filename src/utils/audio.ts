// Web Audio API Synthesizer for Cybersecurity Interactive Effects

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientOsc: OscillatorNode | null = null;

interface CustomWindow extends Window {
  cyberAudioEnabled?: boolean;
  webkitAudioContext?: typeof AudioContext;
}

const initAudio = () => {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || (window as unknown as CustomWindow).webkitAudioContext;
  if (!AudioContextClass) return;
  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime); // Safe master volume
  masterGain.connect(audioCtx.destination);
  
  // Start the background cyber drone
  startAmbientDrone();
};

const startAmbientDrone = () => {
  if (!audioCtx || !masterGain) return;
  
  try {
    // Low triangle wave hum representing processor engine
    ambientOsc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    
    ambientOsc.type = "triangle";
    ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // 55Hz (A1)
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(110, audioCtx.currentTime);
    filter.Q.setValueAtTime(6, audioCtx.currentTime);
    
    lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime); // slow LFO pulse (0.15 Hz)
    lfoGain.gain.setValueAtTime(35, audioCtx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    ambientOsc.connect(filter);
    
    const droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.03, audioCtx.currentTime); // Subtle background hum
    filter.connect(droneGain);
    droneGain.connect(masterGain);
    
    ambientOsc.start();
    lfo.start();
  } catch (e) {
    console.error("Failed to start ambient audio drone:", e);
  }
};

export const toggleAudio = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  (window as unknown as CustomWindow).cyberAudioEnabled = enabled;
  
  if (enabled) {
    try {
      initAudio();
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      if (masterGain) {
        masterGain.gain.setTargetAtTime(0.12, audioCtx!.currentTime, 0.15);
      }
    } catch (e) {
      console.warn("Audio initialization failed due to browser policies:", e);
    }
  } else {
    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    }
  }
};

export const playSound = (type: "hover" | "click" | "alert" | "success" | "block") => {
  if (typeof window === "undefined" || !(window as unknown as CustomWindow).cyberAudioEnabled) return;
  
  try {
    if (!audioCtx) initAudio();
    if (!audioCtx || audioCtx.state === "suspended") return;

    const now = audioCtx.currentTime;
    
    if (type === "hover") {
      // High-pitched micro click for hover transitions
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.connect(gain);
      gain.connect(masterGain!);
      osc.start();
      osc.stop(now + 0.04);
    } else if (type === "click") {
      // Downwards chirping sweep for click execution
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain!);
      osc.start();
      osc.stop(now + 0.09);
    } else if (type === "alert") {
      // Dual-oscillator siren for threat alerts
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = "sawtooth";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(280, now);
      osc1.frequency.linearRampToValueAtTime(560, now + 0.25);
      
      osc2.frequency.setValueAtTime(140, now);
      osc2.frequency.linearRampToValueAtTime(280, now + 0.25);
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain!);
      
      osc1.start();
      osc2.start();
      osc1.stop(now + 0.26);
      osc2.stop(now + 0.26);
    } else if (type === "success") {
      // Cybernetic ascending triad arpeggio for positive validations
      const notes = [293.66, 369.99, 440.00, 587.33]; // D4, F#4, A4, D5 (D Major Triad)
      notes.forEach((freq, index) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.07);
        gain.gain.setValueAtTime(0.04, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.12);
        osc.connect(gain);
        gain.connect(masterGain!);
        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.13);
      });
    } else if (type === "block") {
      // Low detuned buzz representing packet dropping/blocking
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(82, now); // E2 note
      osc.frequency.linearRampToValueAtTime(78, now + 0.22);
      
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, now);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain!);
      
      osc.start();
      osc.stop(now + 0.23);
    }
  } catch (e) {
    console.warn("Web Audio playback failed:", e);
  }
};
