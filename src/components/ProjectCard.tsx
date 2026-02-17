"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Github, Trash2, Edit2, Folder } from "lucide-react";
import { Project, Task, Group } from "@/types";

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
  groups: Group[];
  groupName?: string;
  groupColor?: string;
  onEdit: () => void;
  onDelete: () => void;
  onChangeGroup: (projectId: string, groupId: string | undefined) => void;
};

export default function ProjectCard({ project, tasks, groups, groupName, groupColor, onEdit, onDelete, onChangeGroup }: ProjectCardProps) {
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showGroupPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowGroupPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showGroupPicker]);

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>

          {/* Group badge — click to change */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={(e) => { e.preventDefault(); setShowGroupPicker(!showGroupPicker); }}
              className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                groupName
                  ? "hover:opacity-80"
                  : "text-gray-500 border border-dashed border-gray-600 hover:border-gray-400 hover:text-gray-300"
              }`}
              style={groupName ? {
                backgroundColor: groupColor ? `${groupColor}20` : "rgba(99,102,241,0.13)",
                color: groupColor || "#6366f1",
              } : undefined}
            >
              <Folder className="w-3 h-3" />
              {groupName || "Przypisz grupę"}
            </button>

            {showGroupPicker && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 min-w-[160px] py-1">
                <button
                  onClick={(e) => { e.preventDefault(); onChangeGroup(project.id, undefined); setShowGroupPicker(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    !project.groupId ? "text-indigo-300 bg-indigo-600/20" : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  Brak grupy
                </button>
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={(e) => { e.preventDefault(); onChangeGroup(project.id, g.id); setShowGroupPicker(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors ${
                      project.groupId === g.id ? "text-indigo-300 bg-indigo-600/20" : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
