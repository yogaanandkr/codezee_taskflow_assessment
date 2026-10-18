import type { Task } from "../types/task";
import { isValidDate } from "./taskValidation";

export const TASK_STORAGE_KEY = "taskflow:tasks:v1";

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

export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(TASK_STORAGE_KEY);

    if (stored === null) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      console.warn("Invalid stored tasks: expected an array.");
      return [];
    }

    return parsed.filter(isTask);
  } catch (error) {
    console.warn("Unable to load saved tasks:", error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): boolean {
  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.warn("Unable to save tasks:", error);
    return false;
  }
}
