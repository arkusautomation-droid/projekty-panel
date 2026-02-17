"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Plus, Menu, X } from "lucide-react";
import { getProjects } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Project } from "@/types";

export default function Sidebar({ onNewProject }: { onNewProject?: () => void }) {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, [pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
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
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-indigo-600/20 text-indigo-300"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <div className="mt-6 mb-2 px-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projekty</span>
            {onNewProject && (
              <button onClick={onNewProject} className="text-gray-500 hover:text-indigo-400 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1">
            {projects.map((project) => (
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
        </nav>
      </aside>
    </>
  );
}
