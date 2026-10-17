export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFormValues = Pick<
  Task,
  "title" | "description" | "priority" | "dueDate"
>;

export const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
