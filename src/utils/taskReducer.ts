import type { Task, TaskStatus, TaskFormValues } from "../types/task";

export interface TaskState {
  tasks: Task[];
  revision: number;
}

export type TaskAction =
  | { type: "CREATE"; task: Task }
  | {
      type: "UPDATE";
      id: string;
      values: TaskFormValues;
      updatedAt: string;
    }
  | { type: "DELETE"; id: string }
  | {
      type: "CHANGE_STATUS";
      id: string;
      status: TaskStatus;
      updatedAt: string;
    };

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "CREATE":
      return {
        tasks: [action.task, ...state.tasks],
        revision: state.revision + 1,
      };

    case "UPDATE":
      if (!state.tasks.some(task => task.id === action.id)) {
        return state;
      }

      return {
        tasks: state.tasks.map(task =>
          task.id === action.id
            ? {
                ...task,
                ...action.values,
                updatedAt: action.updatedAt,
              }
            : task,
        ),
        revision: state.revision + 1,
      };

    case "DELETE":
      if (!state.tasks.some(task => task.id === action.id)) {
        return state;
      }

      return {
        tasks: state.tasks.filter(task => task.id !== action.id),
        revision: state.revision + 1,
      };

    case "CHANGE_STATUS":
      if (
        !state.tasks.some(
          task => task.id === action.id && task.status !== action.status,
        )
      ) {
        return state;
      }

      return {
        tasks: state.tasks.map(task =>
          task.id === action.id
            ? {
                ...task,
                status: action.status,
                updatedAt: action.updatedAt,
              }
            : task,
        ),
        revision: state.revision + 1,
      };

    default:
      return state;
  }
}
