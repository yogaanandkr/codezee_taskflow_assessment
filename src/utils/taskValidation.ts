import type { TaskFormValues } from "../types/task";

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;

const isValidDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export function validateTask(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};

  // const title = values.title.trim();
  const title = values.title; // changing to to check codezee's validation
  const description = values.description.trim();

  if (!title) {
    errors.title = "Task title is required.";
  } else if (title.length < 3) {
    errors.title = "Title must contain at least 3 characters.";
  } else if (title.length > 100) {
    errors.title = "Title cannot exceed 100 characters.";
  }

  if (description.length > 500) {
    errors.description = "Description cannot exceed 500 characters.";
  }

  if (!["LOW", "MEDIUM", "HIGH"].includes(values.priority)) {
    errors.priority = "Please select a valid priority.";
  }

  if (values.dueDate && !isValidDate(values.dueDate)) {
    errors.dueDate = "Please enter a valid date.";
  }

  return errors;
}
