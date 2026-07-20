import { useState, useEffect, FormEvent } from "react";
import { Check, Plus, Trash2, Luggage, ClipboardCheck, Sparkles } from "lucide-react";

interface PackingChecklistProps {
  customList: string[];
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  isAiSuggested: boolean;
}

export default function PackingChecklist({ customList }: PackingChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");

  // Populate list on init
  useEffect(() => {
    const defaultEssentials = [
      "Passport & visas/travel ID",
      "Phone charger & wall plug adapter",
      "Toothbrush & personal toiletries",
      "Comfortable sneakers or walking flats",
      "Emergency cash & card back-up"
    ];

    const merged: ChecklistItem[] = [
      ...customList.map((item, idx) => ({
        id: `ai-${idx}`,
        text: item,
        checked: false,
        isAiSuggested: true
      })),
      ...defaultEssentials.map((item, idx) => ({
        id: `essential-${idx}`,
        text: item,
        checked: false,
        isAiSuggested: false
      }))
    ];

    setItems(merged);
  }, [customList]);

  // Check/uncheck item
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Add custom item
  const addItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      checked: false,
      isAiSuggested: false
    };

    setItems((prev) => [newItem, ...prev]);
    setNewItemText("");
  };

  // Delete item
  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const packedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white/70 backdrop-blur-md border border-[#E5E2DD] rounded-[36px] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E5E2DD]/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
            <Luggage className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif italic text-lg text-[#2D2D2A]">Your Packing Assistant</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Customized checklist & essentials</p>
          </div>
        </div>
        
        {totalCount > 0 && (
          <span className="text-[10px] font-mono font-bold bg-[#5A5A40] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
            {packedCount}/{totalCount} Packed
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[#2D2D2A]/75 mb-1.5 font-sans font-medium">
          <span>Packing Progress</span>
          <span className="font-mono font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden border border-[#E5E2DD]/40">
          <div
            className="h-full bg-[#5A5A40] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={addItem} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add custom packing item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs border border-[#E5E2DD] rounded-full bg-white focus:outline-none focus:border-[#5A5A40] font-sans"
        />
        <button
          type="submit"
          className="bg-[#5A5A40] text-white p-2.5 rounded-full hover:bg-[#4E4E37] transition-all flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Checklist Grid */}
      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
        {items.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-400 font-serif italic">Your packing list is empty!</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                item.checked
                  ? "bg-[#F5F2ED]/30 border-[#E5E2DD]/70 opacity-60 line-through text-[#2D2D2A]/50"
                  : "bg-white border-[#E5E2DD] hover:border-[#D9D1C1] text-[#2D2D2A]"
              }`}
            >
              <div className="flex items-center gap-3 pr-2 flex-1">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    item.checked
                      ? "bg-[#5A5A40] border-[#5A5A40] text-white"
                      : "border-[#E5E2DD]"
                  }`}
                >
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                
                <span className="text-xs font-sans font-medium flex-1">
                  {item.text}
                </span>

                {item.isAiSuggested && !item.checked && (
                  <span className="text-[9px] bg-[#D9D1C1]/50 text-[#2D2D2A] px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-0.5 tracking-wider uppercase">
                    <Sparkles className="w-2 h-2 text-[#5A5A40]" /> AI Choice
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
