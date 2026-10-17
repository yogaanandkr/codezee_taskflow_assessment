import { useState } from "react";
import styled from "styled-components";

import { TaskForm } from "./components/tasks/TaskForm";
import { TaskCard } from "./components/tasks/TaskCard";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/TaskUI";
import type { Task, TaskFormValues, TaskStatus } from "./types/task";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

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
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                ...values,
                updatedAt: now,
              }
            : task,
        ),
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...values,
        status: "TODO",
        createdAt: now,
        updatedAt: now,
      };

      setTasks(prev => [newTask, ...prev]);
    }

    closeForm();
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              status,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  const handleDeleteTask = () => {
    if (!deletingTask) return;

    setTasks(prev => prev.filter(task => task.id !== deletingTask.id));

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

      {tasks.length === 0 ? (
        <EmptyState>
          <h2>No tasks yet</h2>
          <Description>Create your first task to get started.</Description>
        </EmptyState>
      ) : (
        <TaskGrid aria-label="Tasks">
          {tasks.map(task => (
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
