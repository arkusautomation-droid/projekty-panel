import { Project, Task, Group, ChecklistItem } from "@/types";

const PROJECTS_KEY = "projekty-panel-projects";
const TASKS_KEY = "projekty-panel-tasks";
const GROUPS_KEY = "projekty-panel-groups";

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

// ============ CHECKLIST ============

export function addChecklistItem(taskId: string, text: string): ChecklistItem | undefined {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return undefined;
  const item: ChecklistItem = { id: generateId(), text, done: false };
  tasks[index].checklist = [...(tasks[index].checklist || []), item];
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return item;
}

export function toggleChecklistItem(taskId: string, itemId: string): void {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return;
  const checklist = tasks[index].checklist || [];
  const itemIndex = checklist.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return;
  checklist[itemIndex].done = !checklist[itemIndex].done;
  tasks[index].checklist = checklist;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function deleteChecklistItem(taskId: string, itemId: string): void {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return;
  tasks[index].checklist = (tasks[index].checklist || []).filter((i) => i.id !== itemId);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// ============ GROUPS ============

export function getGroups(): Group[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(GROUPS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getGroup(id: string): Group | undefined {
  return getGroups().find((g) => g.id === id);
}

export function saveGroup(group: Omit<Group, "id" | "createdAt">): Group {
  const groups = getGroups();
  const newGroup: Group = {
    ...group,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  groups.push(newGroup);
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  return newGroup;
}

export function updateGroup(id: string, data: Partial<Omit<Group, "id" | "createdAt">>): Group | undefined {
  const groups = getGroups();
  const index = groups.findIndex((g) => g.id === id);
  if (index === -1) return undefined;
  groups[index] = { ...groups[index], ...data };
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  return groups[index];
}

export function deleteGroup(id: string): void {
  const groups = getGroups().filter((g) => g.id !== id);
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  // Remove groupId from projects that belonged to this group
  const projects = getProjects().map((p) =>
    p.groupId === id ? { ...p, groupId: undefined } : p
  );
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// ============ SEED DATA ============

export function seedDataIfEmpty(): void {
  const projects = getProjects();
  const groups = getGroups();

  // Seed groups if empty
  let g1Id: string | undefined;
  if (groups.length === 0) {
    const g1 = saveGroup({ name: "Osobiste", color: "#6366f1" });
    saveGroup({ name: "Praca", color: "#f59e0b" });
    g1Id = g1.id;
  }

  // Seed projects if empty
  if (projects.length === 0) {
    const groupId = g1Id || getGroups().find((g) => g.name === "Osobiste")?.id;

    const p1 = saveProject({
      name: "Inner Game Landing",
      description: "Landing page dla Inner Game — coaching i rozwój osobisty",
      url: "https://inner-game-landing.vercel.app",
      githubUrl: "https://github.com/arkusautomation-droid/inner-game-landing",
      status: "active",
      color: "#6366f1",
      groupId,
    });

    const p2 = saveProject({
      name: "SEO Agencja Medialna",
      description: "Landing page dla agencji SEO — usługi marketingowe",
      url: "https://seo-agencja-landing.vercel.app",
      githubUrl: "https://github.com/arkusautomation-droid/seo-agencja-landing",
      status: "active",
      color: "#8b5cf6",
      groupId,
    });

    // Sample tasks with checklist for Inner Game
    saveTask({ projectId: p1.id, title: "Dodać sekcję testimoniali", status: "todo", priority: "medium" });
    const t1 = saveTask({ projectId: p1.id, title: "Poprawić responsywność mobile", status: "in_progress", priority: "high" });
    saveTask({ projectId: p1.id, title: "Skonfigurować domenę", status: "done", priority: "high" });

    // Example checklist on in-progress task
    addChecklistItem(t1.id, "Naprawić menu na telefonie");
    addChecklistItem(t1.id, "Poprawić rozmiar czcionki");
    addChecklistItem(t1.id, "Przetestować na tablecie");

    // Sample tasks with checklist for SEO Agencja
    const t2 = saveTask({ projectId: p2.id, title: "Dodać formularz kontaktowy", status: "todo", priority: "high" });
    saveTask({ projectId: p2.id, title: "Zoptymalizować SEO meta tagi", status: "in_progress", priority: "medium" });
    saveTask({ projectId: p2.id, title: "Deploy na Vercel", status: "done", priority: "high" });

    // Example checklist
    addChecklistItem(t2.id, "Zaprojektować formularz");
    addChecklistItem(t2.id, "Dodać walidację pól");
    addChecklistItem(t2.id, "Podpiąć wysyłkę emaili");
  }
}
