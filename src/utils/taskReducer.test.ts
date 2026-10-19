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

  it("changes only the target status and preserves other fields", () => {
    const secondTask: Task = {
      ...originalTask,
      id: "task-2",
      title: "Second task",
    };

    const state: TaskState = {
      tasks: [originalTask, secondTask],
      revision: 0,
    };

    const updatedAt = "2026-10-19T10:00:00.000Z";

    const result = taskReducer(state, {
      type: "CHANGE_STATUS",
      id: "task-1",
      status: "DONE",
      updatedAt,
    });

    expect(result.tasks[0]).toEqual({
      ...originalTask,
      status: "DONE",
      updatedAt,
    });

    expect(result.tasks[1]).toEqual(secondTask);
    expect(result.tasks[1]).toBe(secondTask);
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

  it.each([
    {
      name: "CREATE",
      action: {
        type: "CREATE" as const,
        task: {
          ...originalTask,
          id: "task-2",
        },
      },
    },
    {
      name: "UPDATE",
      action: {
        type: "UPDATE" as const,
        id: "task-1",
        values: {
          title: "Updated title",
          description: "",
          priority: "LOW" as const,
          dueDate: "",
        },
        updatedAt: "2026-10-19T10:00:00.000Z",
      },
    },
    {
      name: "DELETE",
      action: {
        type: "DELETE" as const,
        id: "task-1",
      },
    },
    {
      name: "CHANGE_STATUS",
      action: {
        type: "CHANGE_STATUS" as const,
        id: "task-1",
        status: "DONE" as const,
        updatedAt: "2026-10-19T10:00:00.000Z",
      },
    },
  ])("does not mutate state during $name", ({ action }) => {
    const state = structuredClone(initialState);
    const snapshot = structuredClone(state);

    taskReducer(state, action);

    expect(state).toEqual(snapshot);
  });

  it("updates only the target task and preserves other fields", () => {
    const secondTask: Task = {
      ...originalTask,
      id: "task-2",
      title: "Second task",
    };

    const state: TaskState = {
      tasks: [originalTask, secondTask],
      revision: 0,
    };

    const updatedAt = "2026-10-19T10:00:00.000Z";

    const result = taskReducer(state, {
      type: "UPDATE",
      id: "task-1",
      values: {
        title: "Updated assessment",
        description: "Updated description",
        priority: "MEDIUM",
        dueDate: "2026-10-25",
      },
      updatedAt,
    });

    expect(result.tasks[0]).toEqual({
      ...originalTask,
      title: "Updated assessment",
      description: "Updated description",
      priority: "MEDIUM",
      dueDate: "2026-10-25",
      updatedAt,
    });

    expect(result.tasks[1]).toEqual(secondTask);
    expect(result.tasks[1]).toBe(secondTask);
    expect(result.revision).toBe(1);
  });
});
