"use client";

import Link from "next/link";
import { ExternalLink, Github, Trash2, Edit2 } from "lucide-react";
import { Project, Task } from "@/types";

const statusLabels: Record<string, string> = {
  active: "Aktywny",
  planned: "Planowany",
  paused: "Wstrzymany",
};

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400",
  planned: "bg-amber-500/20 text-amber-400",
  paused: "bg-gray-500/20 text-gray-400",
};

type ProjectCardProps = {
  project: Project;
  tasks: Task[];
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProjectCard({ project, tasks, onEdit, onDelete }: ProjectCardProps) {
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onDelete(); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <Link href={`/projekt/${project.id}`} className="block">
        <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>

        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Postęp</span>
              <span>{doneTasks}/{totalTasks} ukończonych</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Strona
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Github className="w-3 h-3" />
              GitHub
            </a>
          )}
        </div>
      </Link>
    </div>
  );
}
