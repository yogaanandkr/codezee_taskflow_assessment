import { useMemo, useState } from "react";

import type { Task } from "../types/task";
import { DEFAULT_FILTERS, type TaskFilters } from "../types/taskFilters";
import { filterTasks } from "../utils/taskFilters";

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>(() => ({
    ...DEFAULT_FILTERS,
  }));

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters],
  );

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  return {
    filters,
    filteredTasks,
    setFilters,
    resetFilters,
  };
}
