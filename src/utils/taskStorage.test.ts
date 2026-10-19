import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Task } from "../types/task";

import {
  loadTasks,
  loadTasksWithStatus,
  saveTasks,
  TASK_STORAGE_KEY,
  TASK_BACKUP_KEY,
} from "./taskStorage";

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

  it("marks malformed JSON as requiring a backup", () => {
    localStorage.setItem(TASK_STORAGE_KEY, "{invalid");

    const result = loadTasksWithStatus();

    expect(result.tasks).toEqual([]);
    expect(result.needsBackup).toBe(true);
    expect(localStorage.getItem(TASK_STORAGE_KEY)).toBe("{invalid");
  });

  it("marks partially invalid data as requiring a backup", () => {
    localStorage.setItem(
      TASK_STORAGE_KEY,
      JSON.stringify([validTask, { id: "broken", title: "" }]),
    );

    const result = loadTasksWithStatus();

    expect(result.tasks).toEqual([validTask]);
    expect(result.needsBackup).toBe(true);
  });

  it("backs up corrupted data before saving", () => {
    const corrupted = "{invalid";

    localStorage.setItem(TASK_STORAGE_KEY, corrupted);

    const saved = saveTasks([validTask], true);

    expect(saved).toBe(true);
    expect(localStorage.getItem(TASK_BACKUP_KEY)).toBe(corrupted);
    expect(loadTasks()).toEqual([validTask]);
  });

  it("does not overwrite an existing backup", () => {
    localStorage.setItem(TASK_BACKUP_KEY, "first-backup");
    localStorage.setItem(TASK_STORAGE_KEY, "second-version");

    saveTasks([validTask], true);

    expect(localStorage.getItem(TASK_BACKUP_KEY)).toBe("first-backup");
  });

  it("does not overwrite task data if backup creation fails", () => {
    const corrupted = "{invalid";

    localStorage.setItem(TASK_STORAGE_KEY, corrupted);

    const originalSetItem = Storage.prototype.setItem;

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      function (key, value) {
        if (key === TASK_BACKUP_KEY) {
          throw new Error("Storage quota exceeded");
        }

        return originalSetItem.call(this, key, value);
      },
    );

    expect(saveTasks([validTask], true)).toBe(false);

    expect(localStorage.getItem(TASK_STORAGE_KEY)).toBe(corrupted);
  });
});
