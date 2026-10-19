import { describe, expect, it } from "vitest";

import type { Task } from "../types/task";
import { taskReducer, type TaskState } from "./taskReducer";

const originalTask: Task = {
  id: "task-1",
  title: "Prepare assessment",
  description: "Complete the review",
  priority: "HIGH",
  status: "TODO",
  dueDate: "",
  createdAt: "2026-10-18T10:00:00.000Z",
  updatedAt: "2026-10-18T10:00:00.000Z",
};

const initialState: TaskState = {
  tasks: [originalTask],
  revision: 0,
};

describe("taskReducer", () => {
  it("creates a task", () => {
    const newTask = {
      ...originalTask,
      id: "task-2",
      title: "Write tests",
    };

    const result = taskReducer(initialState, {
      type: "CREATE",
      task: newTask,
    });

    expect(result.tasks).toHaveLength(2);
    expect(result.tasks[0]).toEqual(newTask);
    expect(result.revision).toBe(1);
  });

  it("updates an existing task", () => {
    const result = taskReducer(initialState, {
      type: "UPDATE",
      id: "task-1",
      values: {
        title: "Updated assessment",
        description: "Updated description",
        priority: "MEDIUM",
        dueDate: "",
      },
      updatedAt: "2026-10-19T10:00:00.000Z",
    });

    expect(result.tasks[0].title).toBe("Updated assessment");
    expect(result.tasks[0].priority).toBe("MEDIUM");
    expect(result.tasks[0].updatedAt).toBe("2026-10-19T10:00:00.000Z");
    expect(result.revision).toBe(1);
  });

  it("deletes an existing task", () => {
    const result = taskReducer(initialState, {
      type: "DELETE",
      id: "task-1",
    });

    expect(result.tasks).toEqual([]);
    expect(result.revision).toBe(1);
  });

  it("changes task status", () => {
    const result = taskReducer(initialState, {
      type: "CHANGE_STATUS",
      id: "task-1",
      status: "DONE",
      updatedAt: "2026-10-19T10:00:00.000Z",
    });

    expect(result.tasks[0].status).toBe("DONE");
    expect(result.revision).toBe(1);
  });

  it("does not update a nonexistent task", () => {
    const result = taskReducer(initialState, {
      type: "UPDATE",
      id: "missing",
      values: {
        title: "Missing task",
        description: "",
        priority: "LOW",
        dueDate: "",
      },
      updatedAt: "2026-10-19T10:00:00.000Z",
    });

    expect(result).toBe(initialState);
  });

  it("does not delete a nonexistent task", () => {
    const result = taskReducer(initialState, {
      type: "DELETE",
      id: "missing",
    });

    expect(result).toBe(initialState);
  });

  it("does not update an unchanged status", () => {
    const result = taskReducer(initialState, {
      type: "CHANGE_STATUS",
      id: "task-1",
      status: "TODO",
      updatedAt: "2026-10-19T10:00:00.000Z",
    });

    expect(result).toBe(initialState);
  });

  it("does not mutate the original state", () => {
    const snapshot = structuredClone(initialState);

    taskReducer(initialState, {
      type: "DELETE",
      id: "task-1",
    });

    expect(initialState).toEqual(snapshot);
  });
});
