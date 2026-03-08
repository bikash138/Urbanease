"use client";

import { buildDateOptions } from "./utils";

interface DateSelectorProps {
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

export function DateSelector({ selectedDate, onSelect }: DateSelectorProps) {
  const dateOptions = buildDateOptions();

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
      <h2 className="font-semibold text-zinc-900 flex items-center gap-2.5 text-sm">
        <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold shrink-0">
          2
        </span>
        Choose a Date
      </h2>
      <div className="grid grid-cols-3 gap-2.5">
        {dateOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`px-3 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
              selectedDate === opt.value
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
