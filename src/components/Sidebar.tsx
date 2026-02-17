"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Plus, Menu, X, ChevronRight, Folder } from "lucide-react";
import { getProjects, getGroups, updateProject } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Project, Group } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SidebarProps = {
  onNewProject?: () => void;
  onNewGroup?: () => void;
  selectedGroupId?: string | null;
  onSelectGroup?: (groupId: string | null) => void;
  onProjectMoved?: () => void;
};

// Draggable project item in sidebar
function DraggableProject({ project, pathname }: { project: Project; pathname: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `project-${project.id}`,
    data: { type: "project", project },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link
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
    </div>
  );
}

// Droppable group zone
function DroppableGroup({
  group,
  isExpanded,
  isOver,
  selectedGroupId,
  children,
  onToggle,
  onSelect,
}: {
  group: Group;
  isExpanded: boolean;
  isOver: boolean;
  selectedGroupId?: string | null;
  children: React.ReactNode;
  onToggle: () => void;
  onSelect: () => void;
}) {
  const { setNodeRef } = useDroppable({ id: `group-${group.id}`, data: { type: "group", groupId: group.id } });

  return (
    <div ref={setNodeRef}>
      <div className={`flex items-center rounded-lg transition-colors ${isOver ? "bg-indigo-600/10 ring-1 ring-indigo-500/30" : ""}`}>
        <button
          onClick={onToggle}
          className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
        <button
          onClick={onSelect}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors flex-1 text-left ${
            selectedGroupId === group.id
              ? "bg-indigo-600/20 text-indigo-300"
              : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          }`}
        >
          <Folder className="w-4 h-4 flex-shrink-0" style={{ color: group.color }} />
          <span className="truncate">{group.name}</span>
        </button>
      </div>
      {children}
    </div>
  );
}

// Droppable "ungrouped" zone
function DroppableUngrouped({ isOver, children }: { isOver: boolean; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: "group-__none__", data: { type: "group", groupId: "__none__" } });

  return (
    <div ref={setNodeRef} className={`rounded-lg transition-colors ${isOver ? "bg-indigo-600/10 ring-1 ring-indigo-500/30" : ""}`}>
      {children}
    </div>
  );
}

export default function Sidebar({ onNewProject, onNewGroup, selectedGroupId, onSelectGroup, onProjectMoved }: SidebarProps) {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [overGroupId, setOverGroupId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const refreshData = () => {
    setProjects(getProjects());
    setGroups(getGroups());
  };

  useEffect(() => {
    refreshData();
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

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "project") {
      setActiveProject(data.project as Project);
    }
  };

  const handleDragOver = (event: { over: { id: string | number; data: { current?: Record<string, unknown> } } | null }) => {
    if (event.over?.data.current?.type === "group") {
      setOverGroupId(String(event.over.id));
    } else {
      setOverGroupId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProject(null);
    setOverGroupId(null);

    const { active, over } = event;
    if (!over) return;

    const projectData = active.data.current;
    const dropData = over.data.current;

    if (projectData?.type === "project" && dropData?.type === "group") {
      const project = projectData.project as Project;
      const targetGroupId = dropData.groupId as string;
      const newGroupId = targetGroupId === "__none__" ? undefined : targetGroupId;

      if (project.groupId !== newGroupId) {
        updateProject(project.id, { groupId: newGroupId });
        refreshData();
        onProjectMoved?.();
      }
    }
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

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
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
                const isOver = overGroupId === `group-${group.id}`;

                return (
                  <DroppableGroup
                    key={group.id}
                    group={group}
                    isExpanded={isExpanded}
                    isOver={isOver}
                    selectedGroupId={selectedGroupId}
                    onToggle={() => toggleGroup(group.id)}
                    onSelect={() => onSelectGroup?.(group.id)}
                  >
                    {isExpanded && groupProjects.length > 0 && (
                      <div className="ml-5 pl-2 border-l border-gray-800 space-y-0.5">
                        {groupProjects.map((project) => (
                          <DraggableProject key={project.id} project={project} pathname={pathname} />
                        ))}
                      </div>
                    )}
                    {isExpanded && groupProjects.length === 0 && (
                      <div className="ml-5 pl-2 border-l border-gray-800">
                        <p className="text-xs text-gray-600 px-2 py-1">Przeciągnij tu projekt</p>
                      </div>
                    )}
                  </DroppableGroup>
                );
              })}
            </div>

            {/* Ungrouped projects */}
            <div className="mt-4 mb-2 px-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bez grupy</span>
            </div>
            <DroppableUngrouped isOver={overGroupId === "group-__none__"}>
              <div className="space-y-0.5">
                {ungroupedProjects.length > 0 ? (
                  ungroupedProjects.map((project) => (
                    <DraggableProject key={project.id} project={project} pathname={pathname} />
                  ))
                ) : (
                  <p className="text-xs text-gray-600 px-3 py-1">Przeciągnij tu projekt</p>
                )}
              </div>
            </DroppableUngrouped>

            {/* Drag overlay */}
            <DragOverlay>
              {activeProject && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-gray-800 border border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10 w-52">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: activeProject.color }}
                  />
                  <span className="truncate">{activeProject.name}</span>
                </div>
              )}
            </DragOverlay>
          </DndContext>

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
