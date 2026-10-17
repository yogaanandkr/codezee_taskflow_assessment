import styled from "styled-components";

import type { Task, TaskStatus } from "../../types/task";

import { Button, Select } from "../ui/TaskUI";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const Card = styled.article`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  overflow-wrap: anywhere;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const Priority = styled.span<{ $priority: Task["priority"] }>`
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;

  background: ${({ $priority }) =>
    $priority === "HIGH"
      ? "#fee2e2"
      : $priority === "MEDIUM"
        ? "#fef3c7"
        : "#dcfce7"};

  color: ${({ $priority }) =>
    $priority === "HIGH"
      ? "#991b1b"
      : $priority === "MEDIUM"
        ? "#92400e"
        : "#166534"};
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const StatusLabel = styled.label`
  font-weight: 600;
`;

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  return (
    <Card>
      <CardHeader>
        <Title>{task.title}</Title>
        <Priority $priority={task.priority}>{task.priority}</Priority>
      </CardHeader>

      {task.description && <Description>{task.description}</Description>}

      <Meta>
        <StatusLabel htmlFor={`status-${task.id}`}>Status</StatusLabel>

        <Select
          id={`status-${task.id}`}
          value={task.status}
          onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}
        >
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>

        {task.dueDate && <span>Due: {task.dueDate}</span>}
      </Meta>

      <Actions>
        <Button type="button" onClick={() => onEdit(task)}>
          Edit
        </Button>

        <Button
          type="button"
          $variant="danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </Actions>
    </Card>
  );
}
