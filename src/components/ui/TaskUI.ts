import styled from "styled-components";

export const Button = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
}>`
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary"
        ? theme.colors.primary
        : $variant === "danger"
          ? theme.colors.danger
          : theme.colors.border};

  background: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.primary
      : $variant === "danger"
        ? theme.colors.danger
        : theme.colors.surface};

  color: ${({ theme, $variant }) =>
    $variant === "primary" || $variant === "danger"
      ? "#ffffff"
      : theme.colors.text};

  font-weight: 600;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
`;

const fieldStyles = `
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  outline-offset: 2px;

  &:focus-visible {
    outline: 2px solid #2563eb;
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const TextArea = styled.textarea`
  ${fieldStyles}
  min-height: 90px;
  resize: vertical;
`;

export const Select = styled.select`
  ${fieldStyles}
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 12px;
`;
