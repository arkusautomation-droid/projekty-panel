"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Project, ProjectStatus, Group } from "@/types";

const PROJECT_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
  "#f43f5e", "#f59e0b", "#10b981", "#06b6d4",
];

type ProjectFormProps = {
  project?: Project;
  groups?: Group[];
  onSave: (data: Omit<Project, "id" | "createdAt">) => void;
  onClose: () => void;
};

export default function ProjectForm({ project, groups = [], onSave, onClose }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planned");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [groupId, setGroupId] = useState<string>("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setUrl(project.url || "");
      setGithubUrl(project.githubUrl || "");
      setStatus(project.status);
      setColor(project.color);
      setGroupId(project.groupId || "");
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      url: url.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      status,
      color,
      groupId: groupId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {project ? "Edytuj projekt" : "Nowy projekt"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nazwa</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nazwa projektu"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Opis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krótki opis projektu"
              rows={2}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Grupa</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="">Brak grupy</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">URL strony</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="active">Aktywny</option>
              <option value="planned">Planowany</option>
              <option value="paused">Wstrzymany</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Kolor</label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              {project ? "Zapisz" : "Utwórz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
