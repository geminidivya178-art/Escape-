import { MapPin, Calendar, Globe, Star, Info, Volume2, Landmark } from "lucide-react";
import { EscapeResult } from "../types";

interface DestinationCardProps {
  result: EscapeResult;
}

export default function DestinationCard({ result }: DestinationCardProps) {
  // Try to play audio synthesis for local phrases (using browser TTS safely with checking)
  const speakPhrase = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel currently speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Rough language mapping for speech synthesis
    if (result.country.toLowerCase().includes("japan")) utterance.lang = "ja-JP";
    else if (result.country.toLowerCase().includes("italy")) utterance.lang = "it-IT";
    else if (result.country.toLowerCase().includes("vietnam")) utterance.lang = "vi-VN";
    else if (result.country.toLowerCase().includes("spain")) utterance.lang = "es-ES";
    else if (result.country.toLowerCase().includes("france")) utterance.lang = "fr-FR";
    else if (result.country.toLowerCase().includes("germany")) utterance.lang = "de-DE";
    else utterance.lang = langCode;

    utterance.rate = 0.85; // slightly slower for learning
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-[#E5E2DD] rounded-[36px] p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Banner section */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#5A5A40] text-[#F5F2ED] p-6 sm:p-8 shadow-md">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest bg-white/10 text-[#F5F2ED] px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Star className="w-3 h-3 fill-white/80" /> Surprise Destination
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest bg-white/10 text-[#F5F2ED] px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Best Season: {result.bestTimeToGo}
            </span>
          </div>

          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D9D1C1] block">
              {result.country}
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-white tracking-tight mt-1">
              {result.destination}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#F5F2ED]/90 italic font-serif leading-relaxed max-w-xl border-l-2 border-[#D9D1C1] pl-3">
            &ldquo;{result.tagline}&rdquo;
          </p>
        </div>
      </div>

      {/* Why This Destination Explanation */}
      <div className="space-y-2">
        <h3 className="font-serif italic text-[#2D2D2A] text-xl flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#5A5A40]" /> Why This is Your Escape
        </h3>
        <p className="text-[#2D2D2A]/85 text-sm leading-relaxed font-sans">
          {result.whyThisDestination}
        </p>
      </div>

      {/* Cost Estimates Visual Column */}
      <div className="border-t border-[#E5E2DD]/60 pt-5">
        <h3 className="font-serif italic text-lg text-[#2D2D2A] mb-4 flex items-center gap-2">
          Estimated Traveler Cost Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F5F2ED]/50 p-4 rounded-2xl border border-[#E5E2DD] text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D2D2A]/50 block mb-1">Transit / Flights</span>
            <span className="text-sm font-mono font-bold text-[#2D2D2A]">{result.costEstimates.flights}</span>
          </div>
          <div className="bg-[#F5F2ED]/50 p-4 rounded-2xl border border-[#E5E2DD] text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D2D2A]/50 block mb-1">Lodging (Total)</span>
            <span className="text-sm font-mono font-bold text-[#2D2D2A]">{result.costEstimates.accommodation}</span>
          </div>
          <div className="bg-[#F5F2ED]/50 p-4 rounded-2xl border border-[#E5E2DD] text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D2D2A]/50 block mb-1">Daily Spending / Meals</span>
            <span className="text-sm font-mono font-bold text-[#2D2D2A]">{result.costEstimates.dailyFoodActivity}</span>
          </div>
        </div>
        <div className="bg-[#5A5A40] text-white rounded-2xl p-4 mt-4 border border-[#5A5A40]/10 flex items-center justify-between shadow-sm">
          <span className="text-sm font-semibold tracking-wide text-[#F5F2ED]/90">Grand Total Estimate</span>
          <span className="text-lg font-serif italic font-bold">{result.costEstimates.totalEstimated}</span>
        </div>
      </div>

      {/* Local Phrasebook section */}
      {result.localPhrases && result.localPhrases.length > 0 && (
        <div className="border-t border-[#E5E2DD]/60 pt-5 space-y-3">
          <h3 className="font-serif italic text-lg text-[#2D2D2A] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#5A5A40]" /> Mini Local Phrasebook
          </h3>
          <p className="text-xs opacity-70">Learn a few key expressions to connect with local hosts. Click a speaker to listen.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.localPhrases.map((phrase, idx) => (
              <div 
                key={idx} 
                className="bg-[#F5F2ED]/50 hover:bg-[#F5F2ED] border border-[#E5E2DD] rounded-2xl p-4 flex flex-col justify-between transition-colors group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans font-bold text-sm text-[#2D2D2A] uppercase tracking-wide">{phrase.phrase}</span>
                    <button 
                      onClick={() => speakPhrase(phrase.phrase, "en")}
                      title="Listen"
                      className="p-1.5 bg-white hover:bg-[#D9D1C1]/20 text-[#5A5A40] rounded-full shadow-sm hover:shadow border border-[#E5E2DD] transition-all cursor-pointer opacity-80 hover:opacity-100"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs opacity-85 font-medium italic">{phrase.translation}</p>
                </div>
                <span className="text-[10px] opacity-50 italic mt-2.5 block border-t border-[#E5E2DD] pt-1.5 font-mono">
                  Pronounced: &ldquo;{phrase.pronunciation}&rdquo;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
