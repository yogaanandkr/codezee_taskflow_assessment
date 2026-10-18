import { describe, expect, it } from "vitest";

import type { Task } from "../types/task";
import type { TaskFilters } from "../types/taskFilters";
import { filterTasks } from "./taskFilters";

const tasks: Task[] = [
  {
    id: "1",
    title: "Fix Login Bug",
    description: "Resolve authentication error",
    priority: "HIGH",
    status: "TODO",
    dueDate: "",
    createdAt: "2026-10-17T10:00:00.000Z",
    updatedAt: "2026-10-17T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Build Dashboard",
    description: "Create task summary",
    priority: "MEDIUM",
    status: "DONE",
    dueDate: "",
    createdAt: "2026-10-17T10:00:00.000Z",
    updatedAt: "2026-10-17T10:00:00.000Z",
  },
];

const defaultFilters: TaskFilters = {
  search: "",
  status: "ALL",
  priority: "ALL",
};

describe("filterTasks", () => {
  it("returns all tasks when filters are empty", () => {
    expect(filterTasks(tasks, defaultFilters)).toHaveLength(2);
  });

  it("searches case-insensitively", () => {
    const result = filterTasks(tasks, {
      ...defaultFilters,
      search: "LOGIN",
    });

    expect(result.map(task => task.id)).toEqual(["1"]);
  });

  it("trims whitespace from search", () => {
    const result = filterTasks(tasks, {
      ...defaultFilters,
      search: "  dashboard  ",
    });

    expect(result.map(task => task.id)).toEqual(["2"]);
  });

  it("searches task descriptions", () => {
    const result = filterTasks(tasks, {
      ...defaultFilters,
      search: "authentication",
    });

    expect(result.map(task => task.id)).toEqual(["1"]);
  });

  it("filters by status", () => {
    const result = filterTasks(tasks, {
      ...defaultFilters,
      status: "DONE",
    });

    expect(result.map(task => task.id)).toEqual(["2"]);
  });

  it("filters by priority", () => {
    const result = filterTasks(tasks, {
      ...defaultFilters,
      priority: "HIGH",
    });

    expect(result.map(task => task.id)).toEqual(["1"]);
  });

  it("combines search, status and priority", () => {
    const result = filterTasks(tasks, {
      search: "login",
      status: "TODO",
      priority: "HIGH",
    });

    expect(result.map(task => task.id)).toEqual(["1"]);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterTasks(tasks, {
      search: "missing",
      status: "ALL",
      priority: "ALL",
    });

    expect(result).toEqual([]);
  });

it("does not mutate the original tasks", () => {
  const originalTasks = structuredClone(tasks);

  filterTasks(tasks, {
    ...defaultFilters,
    search: "login",
  });

  expect(tasks).toEqual(originalTasks);
});
  
  
it("returns all tasks for whitespace-only search", () => {
  const result = filterTasks(tasks, {
    ...defaultFilters,
    search: "   ",
  });

  expect(result).toEqual(tasks);
});

it("combines description search with status and priority", () => {
  const result = filterTasks(tasks, {
    search: "authentication",
    status: "TODO",
    priority: "HIGH",
  });

  expect(result.map(task => task.id)).toEqual(["1"]);
});

it("handles an empty task list", () => {
  expect(filterTasks([], defaultFilters)).toEqual([]);
});

it("combines status and priority without search", () => {
  const result = filterTasks(tasks, {
    search: "",
    status: "DONE",
    priority: "MEDIUM",
  });

  expect(result.map(task => task.id)).toEqual(["2"]);
});

});
