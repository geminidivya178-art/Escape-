import { useState } from "react";
import { Sunrise, Sun, Sunset, Utensils, DollarSign, CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { DayPlan } from "../types";

interface ItineraryViewerProps {
  itinerary: DayPlan[];
}

export default function ItineraryViewer({ itinerary }: ItineraryViewerProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const activeDay = itinerary[selectedDayIdx] || itinerary[0];

  return (
    <div className="bg-white/70 backdrop-blur-md border border-[#E5E2DD] rounded-[36px] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E2DD]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif italic text-xl text-[#2D2D2A]">Your Day-by-Day Journey</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Curated, sequential custom plans</p>
          </div>
        </div>
      </div>

      {/* Days Selection Tab Scrollbar */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-thin">
        {itinerary.map((day, idx) => (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => setSelectedDayIdx(idx)}
            className={`flex-none px-5 py-2.5 rounded-full text-xs font-bold tracking-wider snap-center transition-all cursor-pointer uppercase ${
              idx === selectedDayIdx
                ? "bg-[#5A5A40] text-white shadow-sm"
                : "bg-[#F5F2ED] hover:bg-[#D9D1C1]/30 text-[#2D2D2A]/85 border border-[#E5E2DD] hover:border-[#D9D1C1]"
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Main Day Display */}
      {activeDay && (
        <div className="space-y-6 animate-fade-in" key={activeDay.dayNumber}>
          {/* Day Header Banner */}
          <div className="bg-[#F5F2ED] border border-[#E5E2DD] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#5A5A40]">
                Day {activeDay.dayNumber} focus
              </span>
              <h4 className="font-serif italic text-2xl text-[#2D2D2A] mt-0.5">
                {activeDay.title}
              </h4>
            </div>
            
            {activeDay.dayBudget && (
              <div className="flex-none flex items-center gap-1 bg-white border border-[#E5E2DD] px-3.5 py-1.5 rounded-xl">
                <DollarSign className="w-4 h-4 text-[#5A5A40]" />
                <span className="text-xs font-bold font-mono text-[#5A5A40]">
                  EST: {activeDay.dayBudget}
                </span>
              </div>
            )}
          </div>

          {/* Morning / Afternoon / Evening Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Morning */}
            <div className="bg-[#F5F2ED]/40 border border-[#E5E2DD] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[#8B5E3C]">
                  <Sunrise className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Morning</span>
                </div>
                <h5 className="font-serif italic text-[#2D2D2A] text-base leading-tight">
                  {activeDay.morning.activity}
                </h5>
                <p className="text-xs text-[#2D2D2A]/80 leading-relaxed font-sans">
                  {activeDay.morning.description}
                </p>
              </div>
            </div>

            {/* Afternoon */}
            <div className="bg-[#5A5A40]/5 border border-[#E5E2DD] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[#5A5A40]">
                  <Sun className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Afternoon</span>
                </div>
                <h5 className="font-serif italic text-[#2D2D2A] text-base leading-tight">
                  {activeDay.afternoon.activity}
                </h5>
                <p className="text-xs text-[#2D2D2A]/80 leading-relaxed font-sans">
                  {activeDay.afternoon.description}
                </p>
              </div>
            </div>

            {/* Evening */}
            <div className="bg-[#8B5E3C]/5 border border-[#E5E2DD] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[#8B5E3C]">
                  <Sunset className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Evening</span>
                </div>
                <h5 className="font-serif italic text-[#2D2D2A] text-base leading-tight">
                  {activeDay.evening.activity}
                </h5>
                <p className="text-xs text-[#2D2D2A]/80 leading-relaxed font-sans">
                  {activeDay.evening.description}
                </p>
              </div>
            </div>
          </div>

          {/* Day Meal Guide */}
          <div className="bg-[#F5F2ED]/40 rounded-2xl p-5 border border-[#E5E2DD]/60 space-y-3.5">
            <h5 className="text-[10px] font-mono font-bold text-[#5A5A40] uppercase tracking-widest flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#5A5A40]" /> Day Culinary Suggestions
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-[#E5E2DD] p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-mono font-bold text-[#5A5A40]/60 uppercase tracking-widest text-[9px] block">Breakfast</span>
                <p className="text-[#2D2D2A] font-sans font-medium">{activeDay.meals.breakfast}</p>
              </div>
              <div className="bg-white border border-[#E5E2DD] p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-mono font-bold text-[#5A5A40]/60 uppercase tracking-widest text-[9px] block">Lunch</span>
                <p className="text-[#2D2D2A] font-sans font-medium">{activeDay.meals.lunch}</p>
              </div>
              <div className="bg-white border border-[#E5E2DD] p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-mono font-bold text-[#5A5A40]/60 uppercase tracking-widest text-[9px] block">Dinner</span>
                <p className="text-[#2D2D2A] font-sans font-medium">{activeDay.meals.dinner}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
