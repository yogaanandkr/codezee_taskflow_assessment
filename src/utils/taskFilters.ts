import type { Task } from "../types/task";
import type { TaskFilters } from "../types/taskFilters";

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const searchTerm = filters.search.trim().toLowerCase();

  return tasks.filter(task => {
    const matchesSearch =
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm);

    const matchesStatus =
      filters.status === "ALL" || task.status === filters.status;

    const matchesPriority =
      filters.priority === "ALL" || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}
