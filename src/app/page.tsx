"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Database } from "lucide-react";
import { Project, Group } from "@/types";
import {
  getProjects,
  getTasks,
  getGroups,
  saveProject,
  updateProject,
  deleteProject,
  saveGroup,
  updateGroup,
  deleteGroup,
  seedDataIfEmpty,
  loadDemoData,
} from "@/lib/storage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";
import GroupForm from "@/components/GroupForm";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [editingGroup, setEditingGroup] = useState<Group | undefined>();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setProjects(getProjects());
    setGroups(getGroups());
  }, []);

  useEffect(() => {
    seedDataIfEmpty();
    refreshData();
  }, [refreshData]);

  // Project handlers
  const handleSave = (data: Omit<Project, "id" | "createdAt">) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      saveProject(data);
    }
    refreshData();
    setShowForm(false);
    setEditingProject(undefined);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    refreshData();
  };

  const handleNewProject = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleLoadDemo = () => {
    loadDemoData();
    refreshData();
  };

  // Group handlers
  const handleGroupSave = (data: Omit<Group, "id" | "createdAt">) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, data);
    } else {
      saveGroup(data);
    }
    refreshData();
    setShowGroupForm(false);
    setEditingGroup(undefined);
  };

  const handleNewGroup = () => {
    setEditingGroup(undefined);
    setShowGroupForm(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowGroupForm(true);
  };

  const handleDeleteGroup = (id: string) => {
    deleteGroup(id);
    if (selectedGroupId === id) setSelectedGroupId(null);
    refreshData();
  };

  // Filter projects
  const filteredProjects = selectedGroupId === null
    ? projects
    : selectedGroupId === "__ungrouped__"
      ? projects.filter((p) => !p.groupId)
      : projects.filter((p) => p.groupId === selectedGroupId);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onNewProject={handleNewProject}
        onNewGroup={handleNewGroup}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
      />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <Header
          title="Moje Projekty"
          actions={
            <>
              <button
                onClick={handleLoadDemo}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:bg-gray-800 text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                Załaduj demo
              </button>
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nowy projekt
              </button>
            </>
          }
        />

        {/* Group filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedGroupId(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedGroupId === null
                ? "bg-indigo-600/20 text-indigo-300"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            Wszystkie
          </button>
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors group/tab ${
                selectedGroupId === group.id
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
              {group.name}
              <span
                onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }}
                className="ml-1 text-gray-600 hover:text-indigo-400 opacity-0 group-hover/tab:opacity-100 transition-opacity cursor-pointer text-xs"
              >
                ...
              </span>
            </button>
          ))}
          <button
            onClick={() => setSelectedGroupId("__ungrouped__")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedGroupId === "__ungrouped__"
                ? "bg-indigo-600/20 text-indigo-300"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            Bez grupy
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">
              {selectedGroupId ? "Brak projektów w tej grupie." : "Brak projektów. Dodaj swój pierwszy projekt!"}
            </p>
            <button
              onClick={handleNewProject}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Dodaj projekt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                tasks={getTasks(project.id)}
                groupName={groups.find((g) => g.id === project.groupId)?.name}
                groupColor={groups.find((g) => g.id === project.groupId)?.color}
                onEdit={() => handleEdit(project)}
                onDelete={() => handleDelete(project.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <ProjectForm
          project={editingProject}
          groups={groups}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingProject(undefined); }}
        />
      )}

      {showGroupForm && (
        <GroupForm
          group={editingGroup}
          onSave={handleGroupSave}
          onDelete={handleDeleteGroup}
          onClose={() => { setShowGroupForm(false); setEditingGroup(undefined); }}
        />
      )}
    </div>
  );
}
