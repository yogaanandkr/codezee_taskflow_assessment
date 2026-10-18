import { useEffect, useMemo, useState, useReducer } from "react";
import styled from "styled-components";

import { TaskForm } from "./components/tasks/TaskForm";
import { TaskCard } from "./components/tasks/TaskCard";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/TaskUI";
import type { Task, TaskFormValues, TaskStatus } from "./types/task";
import { TaskFilters } from "./components/tasks/TaskFilters";

import {
  DEFAULT_FILTERS,
  type TaskFilters as TaskFiltersType,
} from "./types/taskFilters";

import { filterTasks } from "./utils/taskFilters";

import { loadTasks, saveTasks } from "./utils/taskStorage";
import { taskReducer } from "./utils/taskReducer";
const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0;
`;

const TaskGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 70px 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const Summary = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

export default function App() {
  const [{ tasks, revision }, dispatch] = useReducer(
    taskReducer,
    undefined,
    () => ({
      tasks: loadTasks(),
      revision: 0,
    }),
  );
  useEffect(() => {
    if (revision === 0) return;

    saveTasks(tasks);
  }, [tasks, revision]);

  const [filters, setFilters] = useState<TaskFiltersType>({
    ...DEFAULT_FILTERS,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters],
  );

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };
  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (values: TaskFormValues) => {
    const now = new Date().toISOString();

    if (editingTask) {
      dispatch({
        type: "UPDATE",
        id: editingTask.id,
        values,
        updatedAt: now,
      });
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...values,
        status: "TODO",
        createdAt: now,
        updatedAt: now,
      };

      dispatch({ type: "CREATE", task: newTask });
    }

    closeForm();
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    dispatch({
      type: "CHANGE_STATUS",
      id,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteTask = () => {
    if (!deletingTask) return;

    dispatch({
      type: "DELETE",
      id: deletingTask.id,
    });

    setDeletingTask(null);
  };

  const completedCount = tasks.filter(task => task.status === "DONE").length;

  return (
    <Container>
      <Header>
        <div>
          <Heading>TaskFlow</Heading>
          <Description>Manage your work, one task at a time.</Description>
        </div>

        <Button $variant="primary" onClick={openCreateForm}>
          + Create Task
        </Button>
      </Header>

      <Summary>
        Total tasks: {tasks.length} | Completed: {completedCount}
      </Summary>

      <TaskFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {tasks.length > 0 && (
        <Summary aria-live="polite">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </Summary>
      )}

      {tasks.length === 0 ? (
        <EmptyState>
          <h2>No tasks yet</h2>
          <Description>Create your first task to get started.</Description>
        </EmptyState>
      ) : filteredTasks.length === 0 ? (
        <EmptyState>
          <h2>No matching tasks</h2>
          <Description>Try adjusting your search or filters.</Description>
          <Button type="button" onClick={resetFilters}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <TaskGrid aria-label="Tasks">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditForm}
              onDelete={id => {
                const taskToDelete = tasks.find(item => item.id === id);

                if (taskToDelete) {
                  setDeletingTask(taskToDelete);
                }
              }}
              onStatusChange={handleStatusChange}
            />
          ))}
        </TaskGrid>
      )}

      {isFormOpen && (
        <Modal
          title={editingTask ? "Edit Task" : "Create Task"}
          onClose={closeForm}
        >
          <TaskForm
            task={editingTask}
            onSubmit={handleSaveTask}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deletingTask && (
        <Modal title="Delete Task" onClose={() => setDeletingTask(null)}>
          <p>
            Are you sure you want to delete{" "}
            <strong>{deletingTask.title}</strong>?
          </p>

          <p>This action cannot be undone.</p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Button onClick={() => setDeletingTask(null)}>Cancel</Button>

            <Button $variant="danger" onClick={handleDeleteTask}>
              Delete Task
            </Button>
          </div>
        </Modal>
      )}
    </Container>
  );
}
