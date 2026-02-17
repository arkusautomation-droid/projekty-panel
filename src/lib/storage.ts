import { Project, Task } from "@/types";

const PROJECTS_KEY = "projekty-panel-projects";
const TASKS_KEY = "projekty-panel-tasks";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ============ PROJECTS ============

export function getProjects(): Project[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PROJECTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function saveProject(project: Omit<Project, "id" | "createdAt">): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return newProject;
}

export function updateProject(id: string, data: Partial<Omit<Project, "id" | "createdAt">>): Project | undefined {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  projects[index] = { ...projects[index], ...data };
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return projects[index];
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  // Also delete associated tasks
  const tasks = getTasks().filter((t) => t.projectId !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// ============ TASKS ============

export function getTasks(projectId?: string): Task[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(TASKS_KEY);
  const tasks: Task[] = data ? JSON.parse(data) : [];
  if (projectId) return tasks.filter((t) => t.projectId === projectId);
  return tasks;
}

export function getTask(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id);
}

export function saveTask(task: Omit<Task, "id" | "createdAt">): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return newTask;
}

export function updateTask(id: string, data: Partial<Omit<Task, "id" | "createdAt">>): Task | undefined {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  tasks[index] = { ...tasks[index], ...data };
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return tasks[index];
}

export function deleteTask(id: string): void {
  const tasks = getTasks().filter((t) => t.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// ============ SEED DATA ============

export function seedDataIfEmpty(): void {
  const projects = getProjects();
  if (projects.length > 0) return;

  const p1 = saveProject({
    name: "Inner Game Landing",
    description: "Landing page dla Inner Game — coaching i rozwój osobisty",
    url: "https://inner-game-landing.vercel.app",
    githubUrl: "https://github.com/arkusautomation-droid/inner-game-landing",
    status: "active",
    color: "#6366f1",
  });

  const p2 = saveProject({
    name: "SEO Agencja Medialna",
    description: "Landing page dla agencji SEO — usługi marketingowe",
    url: "https://seo-agencja-landing.vercel.app",
    githubUrl: "https://github.com/arkusautomation-droid/seo-agencja-landing",
    status: "active",
    color: "#8b5cf6",
  });

  // Sample tasks for Inner Game
  saveTask({ projectId: p1.id, title: "Dodać sekcję testimoniali", status: "todo", priority: "medium" });
  saveTask({ projectId: p1.id, title: "Poprawić responsywność mobile", status: "in_progress", priority: "high" });
  saveTask({ projectId: p1.id, title: "Skonfigurować domenę", status: "done", priority: "high" });

  // Sample tasks for SEO Agencja
  saveTask({ projectId: p2.id, title: "Dodać formularz kontaktowy", status: "todo", priority: "high" });
  saveTask({ projectId: p2.id, title: "Zoptymalizować SEO meta tagi", status: "in_progress", priority: "medium" });
  saveTask({ projectId: p2.id, title: "Deploy na Vercel", status: "done", priority: "high" });
}
