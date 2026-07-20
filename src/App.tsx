import { useState, useEffect } from "react";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  Search, 
  Printer, 
  RefreshCw, 
  DollarSign, 
  Plane, 
  Hotel, 
  Camera, 
  Globe, 
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EscapePreferences, EscapeResult, BudgetLevel } from "./types";
import LoadingScreen from "./components/LoadingScreen";
import DestinationCard from "./components/DestinationCard";
import ItineraryViewer from "./components/ItineraryViewer";
import PackingChecklist from "./components/PackingChecklist";
import BudgetCalculator from "./components/BudgetCalculator";

const AVAILABLE_INTERESTS = [
  { id: "beach", label: "Beaches & Sun", emoji: "🏖️", desc: "Relaxation, coastal views, sandy shores" },
  { id: "adventure", label: "Outdoor Adventure", emoji: "🏔️", desc: "Hiking, climbing, active exploration" },
  { id: "history", label: "History & Ruins", emoji: "🏛️", desc: "Ancient sites, museums, historic landmarks" },
  { id: "food", label: "Culinary & Street Food", emoji: "🍜", desc: "Local food tours, cooking, dining" },
  { id: "art", label: "Art, Design & Culture", emoji: "🎨", desc: "Galleries, architecture, local creators" },
  { id: "nature", label: "Nature & Wildlife", emoji: "🌲", desc: "National parks, forests, scenic walks" },
  { id: "nightlife", label: "Nightlife & Markets", emoji: "💃", desc: "Local bars, night markets, festivals" },
  { id: "wellness", label: "Wellness & Zen", emoji: "🧘", desc: "Hot springs, spas, relaxing retreats" },
  { id: "shopping", label: "Markets & Shopping", emoji: "🛍️", desc: "Bazaars, artisan boutiques, malls" }
];

export default function App() {
  const [step, setStep] = useState<"welcome" | "setup" | "loading" | "result">("welcome");
  const [days, setDays] = useState<number>(5);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("mid-range");
  
  const [isKeyActive, setIsKeyActive] = useState<boolean | null>(null);
  const [apiMessage, setApiMessage] = useState<string>("");
  const [result, setResult] = useState<EscapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check key configuration on launch
  useEffect(() => {
    fetch("/api/key-check")
      .then((res) => res.json())
      .then((data) => {
        setIsKeyActive(data.hasKey);
        setApiMessage(data.message);
      })
      .catch((err) => {
        console.error("Error checking key status:", err);
        setIsKeyActive(false);
      });
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerateEscape = async () => {
    setStep("loading");
    setError(null);
    try {
      const response = await fetch("/api/generate-escape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days,
          interests: selectedInterests,
          budgetLevel
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate travel itinerary.");
      }

      const data = await response.json();
      setResult(data);
      setStep("result");
    } catch (err: any) {
      console.error(err);
      setError("We encountered an error sifting through flight paths. Please try again.");
      setStep("setup");
    }
  };

  const startOver = () => {
    setResult(null);
    setStep("setup");
  };

  // Safe Print trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#2D2D2A] flex flex-col font-sans selection:bg-[#D9D1C1] selection:text-[#2D2D2A]">
      
      {/* Premium Header following Natural Tones */}
      <header className="no-print bg-white/60 backdrop-blur-md border-b border-[#E5E2DD] py-4 px-6 sm:px-12 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center text-white font-serif italic text-sm font-bold shadow-sm">
            E
          </div>
          <span className="font-serif italic text-2xl tracking-tight uppercase text-[#2D2D2A]">
            Escape.ai
          </span>
        </div>

        <div className="flex items-center gap-6">
          {isKeyActive !== null && (
            <div className="flex items-center gap-1.5 bg-[#5A5A40]/10 border border-[#5A5A40]/20 px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isKeyActive ? "bg-[#5A5A40] animate-pulse" : "bg-[#8B5E3C]"}`} />
              <span className="text-[10px] sm:text-xs font-mono font-medium text-[#5A5A40] uppercase tracking-wider">
                {isKeyActive ? "Gemini Engine Active" : "Curated Offline"}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME SCREEN */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 sm:py-12"
            >
              {/* Left Column: Asymmetrical Typography Branding */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 sm:pr-8">
                <div className="inline-flex items-center gap-1.5 bg-[#D9D1C1] text-[#2D2D2A] px-3.5 py-1 rounded-full w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Serendipitous Travel Concierge</span>
                </div>
                
                <h1 className="text-5xl sm:text-7xl font-serif italic leading-tight text-[#2D2D2A] tracking-tight">
                  I don't know<br/>where to go.
                </h1>
                
                <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-md">
                  Let our AI weave a sudden journey tailored to your natural rhythm. Just share your parameters, and we'll handle the discovery.
                </p>

                <div className="pt-4">
                  <button
                    type="button"
                    id="start-escape-button"
                    onClick={() => setStep("setup")}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#5A5A40] hover:bg-[#4E4E37] text-white font-semibold rounded-full shadow-lg shadow-[#5A5A40]/10 hover:shadow-[#5A5A40]/20 active:scale-95 transition-all cursor-pointer text-sm uppercase tracking-widest font-sans"
                  >
                    Design My Escape
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Premium Interactive Showcase Display */}
              <div className="lg:col-span-5">
                <div className="bg-[#5A5A40] rounded-[40px] p-8 text-[#F5F2ED] relative overflow-hidden shadow-xl shadow-[#5A5A40]/10 flex flex-col justify-between min-h-[460px]">
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                      <span className="text-[10px] uppercase tracking-widest opacity-60 font-mono font-bold">Featured AI Escape Suggestion</span>
                      <h3 className="text-3xl sm:text-4xl font-serif">The Olive Groves of Puglia</h3>
                      <span className="text-xs italic opacity-80">Italy</span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                        <span className="text-[10px] block opacity-70 uppercase tracking-widest font-mono mb-2">Day 1 Snapshot</span>
                        <p className="text-sm italic font-serif leading-relaxed">
                          &ldquo;Arrive in Bari. A private transfer takes you to a 17th-century Masseria surrounded by ancient olive orchards. Candlelit dinner under the stars with local vintages.&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs opacity-60 font-mono">
                        <span>5 Days</span>
                        <span>Mid-Range</span>
                        <span>Culture & Gastronomy</span>
                      </div>
                    </div>
                  </div>

                  {/* Absolute Blurs for aesthetic depth */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B6B50] rounded-full -mr-20 -mt-20 blur-3xl opacity-40 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A4A30] rounded-full -ml-20 -mb-20 blur-3xl opacity-40 pointer-events-none" />
                  
                  <div className="pt-6 border-t border-white/10 relative z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setDays(5);
                        setSelectedInterests(["food", "history", "nature"]);
                        setBudgetLevel("mid-range");
                        handleGenerateEscape();
                      }}
                      className="w-full py-3.5 bg-[#F5F2ED] text-[#5A5A40] hover:bg-[#EAE6E0] rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Instant Quick Sample
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SETUP SCREEN (DAYS, INTERESTS, BUDGET) */}
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto space-y-8 bg-white/70 backdrop-blur-md border border-[#E5E2DD] rounded-[40px] p-6 sm:p-10 shadow-sm"
            >
              {/* Heading */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#5A5A40] uppercase block">Escape Outline Parameters</span>
                <h2 className="font-serif italic text-3xl sm:text-4xl text-[#2D2D2A] tracking-tight">
                  Wander Parameters
                </h2>
                <p className="text-xs sm:text-sm opacity-70">Tell us your rhythm, and we'll suggest the destination.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Day Selection */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40">
                  How long is your escape?
                </label>
                
                {/* Numeric slider with sand accents */}
                <div className="space-y-2 bg-[#F5F2ED]/50 p-4 rounded-2xl border border-[#E5E2DD]/50">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-mono font-bold text-[#5A5A40]/60 uppercase tracking-widest">DURATION</span>
                    <span className="text-lg font-serif italic font-bold text-[#5A5A40]">{days} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E5E2DD] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                  <div className="flex justify-between text-[9px] text-[#2D2D2A]/40 font-mono">
                    <span>1 DAY</span>
                    <span>1 WEEK</span>
                    <span>2 WEEKS</span>
                  </div>
                </div>

                {/* Day Presets tailored to theme */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[3, 5, 7, 10, 14].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDays(num)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider border transition-all cursor-pointer uppercase ${
                        days === num
                          ? "bg-[#5A5A40] border-[#5A5A40] text-white"
                          : "bg-white border-[#E5E2DD] text-[#2D2D2A]/70 hover:border-[#5A5A40]"
                      }`}
                    >
                      {num === 3 ? "Weekend (3D)" : num === 7 ? "Week (7D)" : `${num} Days`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests Grid with earth-toned feedback */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40">
                    What sparks your interest?
                  </label>
                  <span className="text-[9px] font-mono text-[#2D2D2A]/40 uppercase tracking-widest">Select multiple</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const active = selectedInterests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`text-left p-4 rounded-3xl border transition-all cursor-pointer flex gap-3.5 items-start relative overflow-hidden ${
                          active
                            ? "bg-[#D9D1C1] border-[#D9D1C1] text-[#2D2D2A] shadow-sm"
                            : "bg-white border-[#E5E2DD] text-[#2D2D2A]/80 hover:border-[#D9D1C1]"
                        }`}
                      >
                        <span className="text-2xl leading-none shrink-0 mt-0.5">{interest.emoji}</span>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider">{interest.label}</h4>
                          <p className="text-[10px] opacity-70 leading-normal">{interest.desc}</p>
                        </div>

                        {active && (
                          <div className="absolute top-2.5 right-2.5 bg-[#5A5A40] text-white p-0.5 rounded-full">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Tier Selector */}
              <div className="space-y-3 border-t border-[#E5E2DD]/60 pt-5">
                <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40">
                  Your Budget Level
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Budget/Thrifty */}
                  <button
                    type="button"
                    onClick={() => setBudgetLevel("budget")}
                    className={`p-4 rounded-3xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      budgetLevel === "budget"
                        ? "bg-[#D9D1C1] border-[#D9D1C1] text-[#2D2D2A]"
                        : "bg-white border-[#E5E2DD] text-[#2D2D2A]/80 hover:border-[#D9D1C1]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider">Thrifty</span>
                      <DollarSign className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                    </div>
                    <p className="text-[10px] opacity-75 leading-relaxed">Hostels, local diners, immersion, slower travel.</p>
                  </button>

                  {/* Mid range */}
                  <button
                    type="button"
                    onClick={() => setBudgetLevel("mid-range")}
                    className={`p-4 rounded-3xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      budgetLevel === "mid-range"
                        ? "bg-[#D9D1C1] border-[#D9D1C1] text-[#2D2D2A]"
                        : "bg-white border-[#E5E2DD] text-[#2D2D2A]/80 hover:border-[#D9D1C1]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider">Mid-Range</span>
                      <div className="flex">
                        <DollarSign className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                        <DollarSign className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 -ml-1.5" />
                      </div>
                    </div>
                    <p className="text-[10px] opacity-75 leading-relaxed">Cozy hotels, private transport, authentic bistros.</p>
                  </button>

                  {/* Luxury */}
                  <button
                    type="button"
                    onClick={() => setBudgetLevel("luxury")}
                    className={`p-4 rounded-3xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      budgetLevel === "luxury"
                        ? "bg-[#D9D1C1] border-[#D9D1C1] text-[#2D2D2A]"
                        : "bg-white border-[#E5E2DD] text-[#2D2D2A]/80 hover:border-[#D9D1C1]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider">Luxury</span>
                      <div className="flex">
                        <DollarSign className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                        <DollarSign className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 -ml-1.5" />
                        <DollarSign className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 -ml-1.5" />
                      </div>
                    </div>
                    <p className="text-[10px] opacity-75 leading-relaxed">Premium villas, yachts, luxury tours, fine dining.</p>
                  </button>
                </div>
              </div>

              {/* Action and back */}
              <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-[#E5E2DD]/60">
                <button
                  type="button"
                  onClick={() => setStep("welcome")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-widest border border-[#E5E2DD] rounded-full text-[#2D2D2A]/70 hover:bg-[#F5F2ED] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </button>

                <button
                  type="button"
                  id="generate-escape-button"
                  onClick={handleGenerateEscape}
                  className="flex-1 px-6 py-4 bg-[#8B5E3C] hover:bg-[#785133] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#8B5E3C]/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Generate My Escape
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOADING SCREEN */}
          {step === "loading" && (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <LoadingScreen />
            </motion.div>
          )}

          {/* STEP 4: DETAILED SUGGESTION & BOOKING DASHBOARD */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Back & Print controls */}
              <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E5E2DD] pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startOver}
                    className="px-5 py-2.5 bg-white hover:bg-[#F5F2ED] border border-[#E5E2DD] rounded-full text-[#2D2D2A]/80 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Plan Another Escape
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-5 py-2.5 bg-white hover:bg-[#F5F2ED] border border-[#E5E2DD] rounded-full text-[#2D2D2A]/80 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Save / Print Guide
                  </button>
                </div>
              </div>

              {/* Unified Two-Column Dashboard Layout with Natural Tones Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Destination postcard & Booking tools (5/12) */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Destination Information Postcard */}
                  <DestinationCard result={result} />

                  {/* Booking Launchpad panel (matches design system) */}
                  <div className="no-print bg-white/70 backdrop-blur-md border border-[#E5E2DD] rounded-[32px] p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-[#E5E2DD]/60 pb-3">
                      <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif italic text-lg text-[#2D2D2A]">Book Your Escape</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Reserve secure tickets & lodging</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <a
                        href={`https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(result.destination)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F5F2ED]/50 hover:bg-[#D9D1C1]/30 border border-[#E5E2DD] rounded-2xl flex flex-col items-center justify-center text-center transition-colors group"
                      >
                        <Plane className="w-5 h-5 text-[#5A5A40] mb-1.5" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2A]">Flights</span>
                        <span className="text-[9px] text-gray-400 mt-0.5">Google Travel</span>
                      </a>

                      <a
                        href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(result.destination)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F5F2ED]/50 hover:bg-[#D9D1C1]/30 border border-[#E5E2DD] rounded-2xl flex flex-col items-center justify-center text-center transition-colors group"
                      >
                        <Hotel className="w-5 h-5 text-[#5A5A40] mb-1.5" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2A]">Hotels</span>
                        <span className="text-[9px] text-gray-400 mt-0.5">Booking.com</span>
                      </a>

                      <a
                        href={`https://www.viator.com/search/${encodeURIComponent(result.destination)}?mcid=56757`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F5F2ED]/50 hover:bg-[#D9D1C1]/30 border border-[#E5E2DD] rounded-2xl flex flex-col items-center justify-center text-center transition-colors group"
                      >
                        <Camera className="w-5 h-5 text-[#5A5A40] mb-1.5" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2A]">Activities</span>
                        <span className="text-[9px] text-gray-400 mt-0.5">Viator Guide</span>
                      </a>
                    </div>
                  </div>

                  {/* Interactive Budget Estimator slider tool */}
                  <div className="no-print">
                    <BudgetCalculator originalEstimates={result.costEstimates} numDays={days} />
                  </div>
                </div>

                {/* RIGHT COLUMN: Sequential Day plans & Packing checklists (7/12) */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Detailed Interactive Day Itinerary timeline */}
                  <ItineraryViewer itinerary={result.itinerary} />

                  {/* Packing Checkoff Assistant */}
                  <div className="no-print">
                    <PackingChecklist customList={result.packingList} />
                  </div>
                </div>

              </div>

              {/* Printable simple guide footer for offline download */}
              <div className="print-only hidden print:block pt-12 space-y-6">
                <hr className="border-[#E5E2DD]" />
                <h3 className="font-serif italic text-xl text-[#2D2D2A]">Complete Daily Itinerary Breakdown</h3>
                <div className="space-y-6">
                  {result.itinerary.map((day) => (
                    <div key={day.dayNumber} className="border border-[#E5E2DD] rounded-2xl p-5 space-y-3 print-card">
                      <h4 className="font-serif italic text-base text-[#2D2D2A] border-b border-[#E5E2DD] pb-1.5">
                        Day {day.dayNumber}: {day.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <strong className="text-[#5A5A40] uppercase tracking-wider block text-[10px] mb-1">Morning:</strong>
                          <p>{day.morning.activity} - {day.morning.description}</p>
                        </div>
                        <div>
                          <strong className="text-[#5A5A40] uppercase tracking-wider block text-[10px] mb-1">Afternoon:</strong>
                          <p>{day.afternoon.activity} - {day.afternoon.description}</p>
                        </div>
                        <div>
                          <strong className="text-[#5A5A40] uppercase tracking-wider block text-[10px] mb-1">Evening:</strong>
                          <p>{day.evening.activity} - {day.evening.description}</p>
                        </div>
                      </div>
                      <div className="bg-[#F5F2ED] p-3 rounded-xl text-xs grid grid-cols-3 gap-2 border border-[#E5E2DD]/50">
                        <span><strong>Breakfast:</strong> {day.meals.breakfast}</span>
                        <span><strong>Lunch:</strong> {day.meals.lunch}</span>
                        <span><strong>Dinner:</strong> {day.meals.dinner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Decorative clean footer */}
      <footer className="no-print border-t border-[#E5E2DD] py-6 text-center text-[10px] uppercase tracking-[0.2em] opacity-55 mt-12">
        <p>&copy; {new Date().getFullYear()} Escape.ai Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
