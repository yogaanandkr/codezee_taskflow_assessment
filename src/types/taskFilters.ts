import type { TaskPriority, TaskStatus } from "./task";

export type StatusFilter = TaskStatus | "ALL";
export type PriorityFilter = TaskPriority | "ALL";

export interface TaskFilters {
  search: string;
  status: StatusFilter;
  priority: PriorityFilter;
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  status: "ALL",
  priority: "ALL",
};
