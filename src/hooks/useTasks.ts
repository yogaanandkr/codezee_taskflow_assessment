import { useEffect, useReducer, useRef, useState } from "react";

import type { Task, TaskFormValues, TaskStatus } from "../types/task";

import { taskReducer } from "../utils/taskReducer";
import { loadTasksWithStatus, saveTasks } from "../utils/taskStorage";

export function useTasks() {
  const [initialData] = useState(loadTasksWithStatus);

  const [{ tasks, revision }, dispatch] = useReducer(
    taskReducer,
    initialData.tasks,
    initialTasks => ({
      tasks: initialTasks,
      revision: 0,
    }),
  );

  const backupRequiredRef = useRef(initialData.needsBackup);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    if (revision === 0) return;

    const saved = saveTasks(tasks, backupRequiredRef.current);

    if (saved) {
      backupRequiredRef.current = false;
    }

    // React may render this effect after state updates.
    // Updating error state here reflects the actual storage result.
    setStorageError(!saved);
  }, [tasks, revision]);

  const createTask = (values: TaskFormValues) => {
    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      ...values,
      status: "TODO",
      createdAt: now,
      updatedAt: now,
    };

    dispatch({ type: "CREATE", task });
  };

  const updateTask = (id: string, values: TaskFormValues) => {
    dispatch({
      type: "UPDATE",
      id,
      values,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE", id });
  };

  const changeTaskStatus = (id: string, status: TaskStatus) => {
    dispatch({
      type: "CHANGE_STATUS",
      id,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  const completedCount = tasks.filter(task => task.status === "DONE").length;

  return {
    tasks,
    completedCount,
    storageError,
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
  };
}
