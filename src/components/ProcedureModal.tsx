"use client";

import { useState } from "react";
import { Play, Plus, Trash2 } from "lucide-react";

type ProcedureModalProps = {
  taskTitle: string;
  onSave: (steps: string[]) => void;
  onSkip: () => void;
};

export default function ProcedureModal({ taskTitle, onSave, onSkip }: ProcedureModalProps) {
  const [steps, setSteps] = useState<string[]>([""]);

  const addStep = () => setSteps([...steps, ""]);

  const updateStep = (index: number, value: string) => {
    const next = [...steps];
    next[index] = value;
    setSteps(next);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const valid = steps.map((s) => s.trim()).filter(Boolean);
    if (valid.length > 0) onSave(valid);
    else onSkip();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === steps.length - 1) addStep();
      // Focus next input
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>("[data-step-input]");
        inputs[index + 1]?.focus();
      }, 50);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
        <div className="flex items-center gap-3 p-5 border-b border-gray-700">
          <div className="p-2 rounded-lg bg-indigo-500/20">
            <Play className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Rozpoczynasz zadanie</h2>
            <p className="text-sm text-gray-400 truncate">{taskTitle}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-300">
            Opisz kroki do wykonania — będziesz mógł je odhaczać w trakcie pracy:
          </p>

          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-5 text-right flex-shrink-0">{index + 1}.</span>
                <input
                  data-step-input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder={`Krok ${index + 1}...`}
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                  autoFocus={index === 0}
                />
                {steps.length > 1 && (
                  <button
                    onClick={() => removeStep(index)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addStep}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Dodaj krok
          </button>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Pomiń
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Rozpocznij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
