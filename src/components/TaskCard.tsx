"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Edit2 } from "lucide-react";
import { Task } from "@/types";

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
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
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
