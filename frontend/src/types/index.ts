export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  dueDate?: string;
  taskCount: number;
  completedTasksCount: number;
  completionRate: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
}

export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overallCompletionRate: number;
}

export interface CreateProjectInput {
  organizationId: number;
  name: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateProjectInput {
  id: number;
  name?: string;
  description?: string;
  status?: string;
  dueDate?: string;
}

export interface CreateTaskInput {
  projectId: number;
  title: string;
  description?: string;
  assigneeEmail?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  assigneeEmail?: string;
  dueDate?: string;
}