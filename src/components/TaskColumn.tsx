"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Task, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";

const columnConfig: Record<TaskStatus, { title: string; color: string }> = {
  todo: { title: "Do zrobienia", color: "border-amber-500/50" },
  in_progress: { title: "W trakcie", color: "border-indigo-500/50" },
  done: { title: "Gotowe", color: "border-green-500/50" },
};

type TaskColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

export default function TaskColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];

  return (
    <div
      className={`flex flex-col bg-gray-900/50 rounded-xl border-t-2 ${config.color} min-h-[200px] md:min-h-[400px] transition-colors ${
        isOver ? "bg-gray-800/50" : ""
      }`}
    >
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-200 text-sm">{config.title}</h3>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 p-2 pt-0 space-y-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
