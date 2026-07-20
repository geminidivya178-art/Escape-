import { useState, useEffect } from "react";
import { Compass, Sparkles, MapPin, Globe, Plane } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const loadingTexts = [
  "Sifting through coordinates of hidden gems...",
  "Consulting with veteran local guides...",
  "Analyzing regional food guides and markets...",
  "Stretching budgets for the ultimate value...",
  "Mapping daily walking loops and panoramic viewpoints...",
  "Checking local weather patterns and travel advisories...",
  "Assembling your custom digital guidebook...",
  "Drafting the perfect escape itinerary just for you..."
];

export default function LoadingScreen() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[450px]">
      {/* Spinning Compass Core */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-[#5A5A40]/10 rounded-full blur-3xl w-40 h-40 -translate-x-12 -translate-y-12 animate-pulse" />
        
        {/* Animated Flight Path Ring */}
        <div className="absolute inset-0 border-2 border-dashed border-[#E5E2DD] rounded-full w-24 h-24 animate-spin [animation-duration:15s]" />
        
        {/* Radar Pulse */}
        <div className="absolute inset-2 border border-[#5A5A40]/20 rounded-full w-20 h-20 animate-ping [animation-duration:2.5s]" />
        
        <div className="relative flex items-center justify-center w-24 h-24 bg-white shadow-xl rounded-full border border-[#E5E2DD]">
          <Compass className="w-10 h-10 text-[#5A5A40] animate-spin [animation-duration:6s]" />
          <motion.div 
            className="absolute -top-1 -right-1 bg-[#8B5E3C] text-white p-1 rounded-full shadow-lg"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <h3 className="font-serif italic text-2xl text-[#2D2D2A] mb-2 flex items-center justify-center gap-2">
          Mapping Your Escape
        </h3>
        
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-[#2D2D2A]/70 text-sm italic font-serif"
            >
              {loadingTexts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Small Progress Dots */}
        <div className="flex gap-1.5 justify-center mt-6">
          {loadingTexts.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === textIndex ? "w-6 bg-[#5A5A40]" : "w-1.5 bg-[#E5E2DD]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
