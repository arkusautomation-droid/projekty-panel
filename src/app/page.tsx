"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Project } from "@/types";
import {
  getProjects,
  getTasks,
  saveProject,
  updateProject,
  deleteProject,
  seedDataIfEmpty,
} from "@/lib/storage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const refreshProjects = useCallback(() => {
    setProjects(getProjects());
  }, []);

  useEffect(() => {
    seedDataIfEmpty();
    refreshProjects();
  }, [refreshProjects]);

  const handleSave = (data: Omit<Project, "id" | "createdAt">) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      saveProject(data);
    }
    refreshProjects();
    setShowForm(false);
    setEditingProject(undefined);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    refreshProjects();
  };

  const handleNewProject = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onNewProject={handleNewProject} />

      <main className="flex-1 ml-64 p-8">
        <Header
          title="Moje Projekty"
          actions={
            <button
              onClick={handleNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nowy projekt
            </button>
          }
        />

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Brak projektów. Dodaj swój pierwszy projekt!</p>
            <button
              onClick={handleNewProject}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Dodaj projekt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                tasks={getTasks(project.id)}
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
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingProject(undefined); }}
        />
      )}
    </div>
  );
}
