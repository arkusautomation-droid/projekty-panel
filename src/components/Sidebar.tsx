"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Plus, Menu, X, ChevronRight, Folder } from "lucide-react";
import { getProjects, getGroups } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Project, Group } from "@/types";

type SidebarProps = {
  onNewProject?: () => void;
  onNewGroup?: () => void;
  selectedGroupId?: string | null;
  onSelectGroup?: (groupId: string | null) => void;
};

export default function Sidebar({ onNewProject, onNewGroup, selectedGroupId, onSelectGroup }: SidebarProps) {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    setProjects(getProjects());
    setGroups(getGroups());
  }, [pathname, selectedGroupId]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const ungroupedProjects = projects.filter((p) => !p.groupId);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-40 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-indigo-400" />
            <span className="text-lg font-bold text-white">Projekty</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <button
            onClick={() => onSelectGroup?.(null)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              pathname === "/" && selectedGroupId === null
                ? "bg-indigo-600/20 text-indigo-300"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          {/* Groups section */}
          <div className="mt-6 mb-2 px-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupy</span>
            {onNewGroup && (
              <button onClick={onNewGroup} className="text-gray-500 hover:text-indigo-400 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {groups.map((group) => {
              const groupProjects = projects.filter((p) => p.groupId === group.id);
              const isExpanded = expandedGroups.has(group.id);

              return (
                <div key={group.id}>
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                    <button
                      onClick={() => onSelectGroup?.(group.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors flex-1 text-left ${
                        selectedGroupId === group.id
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      }`}
                    >
                      <Folder className="w-4 h-4 flex-shrink-0" style={{ color: group.color }} />
                      <span className="truncate">{group.name}</span>
                      <span className="text-xs text-gray-600 ml-auto">{groupProjects.length}</span>
                    </button>
                  </div>

                  {isExpanded && groupProjects.length > 0 && (
                    <div className="ml-5 pl-2 border-l border-gray-800 space-y-0.5">
                      {groupProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projekt/${project.id}`}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                            pathname === `/projekt/${project.id}`
                              ? "bg-indigo-600/20 text-indigo-300"
                              : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="truncate">{project.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ungrouped projects */}
          {ungroupedProjects.length > 0 && (
            <>
              <div className="mt-4 mb-2 px-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bez grupy</span>
              </div>
              <div className="space-y-0.5">
                {ungroupedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projekt/${project.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      pathname === `/projekt/${project.id}`
                        ? "bg-indigo-600/20 text-indigo-300"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* New project shortcut */}
          <div className="mt-4">
            {onNewProject && (
              <button
                onClick={onNewProject}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors w-full"
              >
                <Plus className="w-4 h-4" />
                Nowy projekt
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
