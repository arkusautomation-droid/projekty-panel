"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Edit2, Plus, X, Check } from "lucide-react";
import { Task } from "@/types";
import { addChecklistItem, toggleChecklistItem, deleteChecklistItem } from "@/lib/storage";

const priorityColors: Record<string, string> = {
  low: "bg-green-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

const priorityLabels: Record<string, string> = {
  low: "Niski",
  medium: "Średni",
  high: "Wysoki",
};

type TaskCardProps = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: () => void;
};

export default function TaskCard({ task, onEdit, onDelete, onUpdate }: TaskCardProps) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const checklist = task.checklist || [];
  const doneCount = checklist.filter((i) => i.done).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    addChecklistItem(task.id, newItemText.trim());
    setNewItemText("");
    setShowAddItem(false);
    onUpdate();
  };

  const handleToggle = (itemId: string) => {
    toggleChecklistItem(task.id, itemId);
    onUpdate();
  };

  const handleDeleteItem = (itemId: string) => {
    deleteChecklistItem(task.id, itemId);
    onUpdate();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-800 border border-gray-700/50 rounded-lg p-3 group transition-all ${
        isDragging ? "opacity-50 shadow-xl shadow-indigo-500/10" : "hover:border-gray-600"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
          )}

          {/* Progress bar */}
          {totalCount > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Postęp</span>
                <span>{doneCount}/{totalCount}</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${progress === 100 ? "bg-green-500" : "bg-indigo-500"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Checklist items */}
          {checklist.length > 0 && (
            <div className="mt-2 space-y-1">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group/item">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                      item.done
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : "border-gray-600 hover:border-indigo-500"
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3" />}
                  </button>
                  <span className={`text-xs flex-1 ${item.done ? "text-gray-500 line-through" : "text-gray-300"}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-0.5 text-gray-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add checklist item */}
          {showAddItem ? (
            <div className="mt-2 flex items-center gap-1">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddItem(); if (e.key === "Escape") setShowAddItem(false); }}
                placeholder="Nowy krok..."
                className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <button onClick={handleAddItem} className="p-1 text-indigo-400 hover:text-indigo-300">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setShowAddItem(false)} className="p-1 text-gray-500 hover:text-gray-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddItem(true)}
              className="mt-2 flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-400 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Dodaj krok
            </button>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]}`} />
              {priorityLabels[task.priority]}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
