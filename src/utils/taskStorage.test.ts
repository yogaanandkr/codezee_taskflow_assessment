import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Task } from "../types/task";

import { loadTasks, saveTasks, TASK_STORAGE_KEY } from "./taskStorage";

const validTask: Task = {
  id: "task-1",
  title: "Fix login bug",
  description: "Resolve authentication issue",
  priority: "HIGH",
  status: "TODO",
  dueDate: "",
  createdAt: "2026-10-17T10:00:00.000Z",
  updatedAt: "2026-10-17T10:00:00.000Z",
};

describe("taskStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns an empty array when storage is empty", () => {
    expect(loadTasks()).toEqual([]);
  });

  it("saves and loads tasks", () => {
    expect(saveTasks([validTask])).toBe(true);
    expect(loadTasks()).toEqual([validTask]);
  });

  it("handles malformed JSON", () => {
    localStorage.setItem(TASK_STORAGE_KEY, "{invalid");

    expect(loadTasks()).toEqual([]);
  });

  it("rejects non-array stored data", () => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify({ id: "wrong" }));

    expect(loadTasks()).toEqual([]);
  });

  it("ignores invalid task records", () => {
    localStorage.setItem(
      TASK_STORAGE_KEY,
      JSON.stringify([validTask, { id: "invalid", title: "" }]),
    );

    expect(loadTasks()).toEqual([validTask]);
  });

  it("handles storage write failures", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage quota exceeded");
    });

    expect(saveTasks([validTask])).toBe(false);
  });

  it("rejects impossible due dates", () => {
    const invalidTask = {
      ...validTask,
      dueDate: "2026-13-45",
    };

    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([invalidTask]));

    expect(loadTasks()).toEqual([]);
  });
});
