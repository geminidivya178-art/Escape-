import { useState, useEffect } from "react";
import { DollarSign, Percent, Calculator, Info, Wallet } from "lucide-react";

interface BudgetCalculatorProps {
  originalEstimates: {
    flights: string;
    accommodation: string;
    dailyFoodActivity: string;
    totalEstimated: string;
  };
  numDays: number;
}

export default function BudgetCalculator({ originalEstimates, numDays }: BudgetCalculatorProps) {
  // Parse original string estimates safely to numbers
  const parseCostRange = (str: string, defaultVal: number): number => {
    const numbers = str.replace(/[^0-9]/g, "");
    if (numbers.length === 0) return defaultVal;
    
    // If it's a range like 500 - 700, parse both and average them
    const matches = str.match(/\d+/g);
    if (matches && matches.length >= 2) {
      return Math.round((parseInt(matches[0]) + parseInt(matches[1])) / 2);
    } else if (matches && matches.length === 1) {
      return parseInt(matches[0]);
    }
    return defaultVal;
  };

  const initialFlights = parseCostRange(originalEstimates.flights, 600);
  const initialTotalAcc = parseCostRange(originalEstimates.accommodation, 300);
  const initialAccPerNight = Math.round(initialTotalAcc / numDays) || 50;
  const initialDailyExpense = parseCostRange(originalEstimates.dailyFoodActivity, 40);

  // States for user adjustment
  const [flights, setFlights] = useState(initialFlights);
  const [accPerNight, setAccPerNight] = useState(initialAccPerNight);
  const [dailyExpense, setDailyExpense] = useState(initialDailyExpense);
  const [miscCost, setMiscCost] = useState(50); // Small cushion
  
  const totalAcc = accPerNight * numDays;
  const totalDaily = dailyExpense * numDays;
  const grandTotal = flights + totalAcc + totalDaily + miscCost;

  // Compare to average original estimate
  const originalGrandAvg = parseCostRange(originalEstimates.totalEstimated, 1500);
  const savings = originalGrandAvg - grandTotal;

  return (
    <div className="bg-white/70 backdrop-blur-md border border-[#E5E2DD] rounded-[36px] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 border-b border-[#E5E2DD]/60 pb-3">
        <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif italic text-lg text-[#2D2D2A]">Custom Budget Estimator</h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Fine-tune your expenses for a {numDays}-day escape</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Sliders */}
        <div className="space-y-4">
          {/* Flight Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D2D2A]/85 mb-1.5">
              <span>Flight / Transit (Total)</span>
              <span className="text-[#5A5A40] font-bold">${flights}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={flights}
              onChange={(e) => setFlights(Number(e.target.value))}
              className="w-full h-1.5 bg-[#F5F2ED] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>$100</span>
              <span className="italic font-serif">Original: {originalEstimates.flights}</span>
              <span>$2,500</span>
            </div>
          </div>

          {/* Accommodation Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D2D2A]/85 mb-1.5">
              <span>Lodging (Per Night)</span>
              <span className="text-[#5A5A40] font-bold">${accPerNight}/night</span>
            </div>
            <input
              type="range"
              min="10"
              max="600"
              step="10"
              value={accPerNight}
              onChange={(e) => setAccPerNight(Number(e.target.value))}
              className="w-full h-1.5 bg-[#F5F2ED] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>$10/nt</span>
              <span className="font-mono">Total Lodging: ${totalAcc}</span>
              <span>$600/nt</span>
            </div>
          </div>

          {/* Daily spending slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D2D2A]/85 mb-1.5">
              <span>Meals & Activities (Per Day)</span>
              <span className="text-[#5A5A40] font-bold">${dailyExpense}/day</span>
            </div>
            <input
              type="range"
              min="10"
              max="400"
              step="5"
              value={dailyExpense}
              onChange={(e) => setDailyExpense(Number(e.target.value))}
              className="w-full h-1.5 bg-[#F5F2ED] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>$10/day</span>
              <span className="font-mono">Total Spend: ${totalDaily}</span>
              <span>$400/day</span>
            </div>
          </div>

          {/* Misc/Cushion */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#2D2D2A]/85 mb-1.5">
              <span>Emergency Fund / Cushions</span>
              <span className="text-[#5A5A40] font-bold">${miscCost}</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={miscCost}
              onChange={(e) => setMiscCost(Number(e.target.value))}
              className="w-full h-1.5 bg-[#F5F2ED] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
            />
          </div>
        </div>

        {/* Right Side: Visual Total Card */}
        <div className="bg-[#F5F2ED]/60 rounded-2xl p-5 flex flex-col justify-between border border-[#E5E2DD]">
          <div>
            <span className="text-[10px] font-bold text-[#2D2D2A]/50 uppercase tracking-widest block mb-1">
              Customized Total
            </span>
            <div className="flex items-baseline text-[#5A5A40]">
              <span className="text-3xl font-serif italic font-bold">${grandTotal.toLocaleString()}</span>
              <span className="text-xs text-gray-500 ml-1.5 font-mono font-bold">USD</span>
            </div>
          </div>

          {/* Mini Breakdown */}
          <div className="space-y-2.5 my-4">
            <div className="flex justify-between text-xs text-[#2D2D2A]/80 font-sans">
              <span>Flights & Transit:</span>
              <span className="font-mono font-semibold">${flights}</span>
            </div>
            <div className="flex justify-between text-xs text-[#2D2D2A]/80 font-sans">
              <span>Lodging ({numDays} nights):</span>
              <span className="font-mono font-semibold">${totalAcc}</span>
            </div>
            <div className="flex justify-between text-xs text-[#2D2D2A]/80 font-sans">
              <span>Meals & Fun ({numDays} days):</span>
              <span className="font-mono font-semibold">${totalDaily}</span>
            </div>
            <div className="flex justify-between text-xs text-[#2D2D2A]/80 font-sans">
              <span>Emergency/Misc:</span>
              <span className="font-mono font-semibold">${miscCost}</span>
            </div>
          </div>

          {/* Savings Callout */}
          <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#5A5A40]" />
              <span className="text-gray-500 font-medium font-serif italic">vs. AI Suggestion</span>
            </div>
            {savings > 0 ? (
              <span className="text-[#5A5A40] font-bold font-mono">-${savings} Saved</span>
            ) : savings < 0 ? (
              <span className="text-[#8B5E3C] font-bold font-mono">+${Math.abs(savings)} Added</span>
            ) : (
              <span className="text-gray-600 font-mono">Matched</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
