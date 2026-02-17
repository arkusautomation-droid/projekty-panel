"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/types";
import { getProject, seedDataIfEmpty } from "@/lib/storage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TaskBoard from "@/components/TaskBoard";

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    seedDataIfEmpty();
    const id = params.id as string;
    setProject(getProject(id));
  }, [params.id]);

  if (!project) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="text-center py-20 text-gray-400">
            Ładowanie...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <Header
          title={project.name}
          backHref="/"
          actions={
            <div className="flex items-center gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Strona
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-300 border border-gray-600/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
            </div>
          }
        />

        {project.description && (
          <p className="text-gray-400 text-sm mb-6 -mt-4">{project.description}</p>
        )}

        <TaskBoard projectId={project.id} />
      </main>
    </div>
  );
}
