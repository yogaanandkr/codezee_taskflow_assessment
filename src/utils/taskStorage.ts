import type { Task } from "../types/task";
import { isValidDate } from "./taskValidation";

export const TASK_STORAGE_KEY = "taskflow:tasks:v1";
export const TASK_BACKUP_KEY = "taskflow:tasks:backup:v1";

const priorities = ["LOW", "MEDIUM", "HIGH"];
const statuses = ["TODO", "IN_PROGRESS", "DONE"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length >= 3 &&
    value.title.trim().length <= 100 &&
    typeof value.description === "string" &&
    value.description.trim().length <= 500 &&
    typeof value.priority === "string" &&
    priorities.includes(value.priority) &&
    typeof value.status === "string" &&
    statuses.includes(value.status) &&
    typeof value.dueDate === "string" &&
    (value.dueDate === "" || isValidDate(value.dueDate)) &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    typeof value.updatedAt === "string" &&
    !Number.isNaN(Date.parse(value.updatedAt))
  );
}

export interface LoadTasksResult {
  tasks: Task[];
  needsBackup: boolean;
}

export function loadTasksWithStatus(): LoadTasksResult {
  try {
    const raw = localStorage.getItem(TASK_STORAGE_KEY);

    if (raw === null) {
      return { tasks: [], needsBackup: false };
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return { tasks: [], needsBackup: true };
    }

    const validTasks = parsed.filter(isTask);

    return {
      tasks: validTasks,
      needsBackup: validTasks.length !== parsed.length,
    };
  } catch (error) {
    console.warn("Unable to load saved tasks:", error);

    // Conservatively require backup before the next write.
    return { tasks: [], needsBackup: true };
  }
}

export function loadTasks(): Task[] {
  return loadTasksWithStatus().tasks;
}

export function saveTasks(tasks: Task[], preserveOriginal = false): boolean {
  try {
    if (preserveOriginal) {
      const original = localStorage.getItem(TASK_STORAGE_KEY);

      if (original !== null && localStorage.getItem(TASK_BACKUP_KEY) === null) {
        localStorage.setItem(TASK_BACKUP_KEY, original);
      }
    }

    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));

    return true;
  } catch (error) {
    console.warn("Unable to save tasks:", error);
    return false;
  }
}
