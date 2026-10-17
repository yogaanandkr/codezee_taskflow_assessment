import { useEffect, useState } from "react";
import styled from "styled-components";

import type { Task, TaskFormValues, TaskPriority } from "../../types/task";

import { validateTask, type TaskFormErrors } from "../../utils/taskValidation";

import {
  Button,
  ErrorText,
  Field,
  Input,
  Label,
  Select,
  TextArea,
} from "../ui/TaskUI";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const initialValues: TaskFormValues = {
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
};

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(
    task
      ? {
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
        }
      : initialValues,
  );

  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(
      task
        ? {
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
          }
        : initialValues,
    );
    setErrors({});
  }, [task]);

  const updateField = <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateTask(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority,
        dueDate: values.dueDate,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Field>
        <Label htmlFor="task-title">Task title *</Label>
        <Input
          id="task-title"
          value={values.title}
          maxLength={110}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          onChange={e => updateField("title", e.target.value)}
          placeholder="Enter task title"
        />
        {errors.title && (
          <ErrorText id="title-error" role="alert">
            {errors.title}
          </ErrorText>
        )}
      </Field>

      <Field>
        <Label htmlFor="task-description">Description</Label>
        <TextArea
          id="task-description"
          value={values.description}
          maxLength={510}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          onChange={e => updateField("description", e.target.value)}
          placeholder="Describe the task"
        />
        {errors.description && (
          <ErrorText id="description-error" role="alert">
            {errors.description}
          </ErrorText>
        )}
      </Field>

      <Field>
        <Label htmlFor="task-priority">Priority</Label>
        <Select
          id="task-priority"
          value={values.priority}
          onChange={e =>
            updateField("priority", e.target.value as TaskPriority)
          }
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
        {errors.priority && (
          <ErrorText role="alert">{errors.priority}</ErrorText>
        )}
      </Field>

      <Field>
        <Label htmlFor="task-due-date">Due date</Label>
        <Input
          id="task-due-date"
          type="date"
          value={values.dueDate}
          aria-invalid={!!errors.dueDate}
          onChange={e => updateField("dueDate", e.target.value)}
        />
        {errors.dueDate && <ErrorText role="alert">{errors.dueDate}</ErrorText>}
      </Field>

      <Actions>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" $variant="primary" disabled={isSubmitting}>
          {task ? "Save changes" : "Create task"}
        </Button>
      </Actions>
    </Form>
  );
}
