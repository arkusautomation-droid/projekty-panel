"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Group } from "@/types";

const GROUP_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
  "#f43f5e", "#f59e0b", "#10b981", "#06b6d4",
];

type GroupFormProps = {
  group?: Group;
  onSave: (data: Omit<Group, "id" | "createdAt">) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
};

export default function GroupForm({ group, onSave, onDelete, onClose }: GroupFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(GROUP_COLORS[0]);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setColor(group.color);
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), color });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {group ? "Edytuj grupę" : "Nowa grupa"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nazwa</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nazwa grupy"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Kolor</label>
            <div className="flex gap-2">
              {GROUP_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {group && onDelete && (
            <button
              type="button"
              onClick={() => { onDelete(group.id); onClose(); }}
              className="w-full px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Usuń grupę
            </button>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              {group ? "Zapisz" : "Utwórz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
