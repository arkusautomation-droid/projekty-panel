export type ProjectStatus = "active" | "planned" | "paused";

export type Project = {
  id: string;
  name: string;
  description: string;
  url?: string;
  githubUrl?: string;
  status: ProjectStatus;
  color: string;
  groupId?: string;
  createdAt: string;
};

export type Group = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
};
