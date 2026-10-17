import styled from "styled-components";

import type {
  TaskFilters as TaskFiltersType,
  StatusFilter,
  PriorityFilter,
} from "../../types/taskFilters";

import { Button, Input, Select } from "../ui/TaskUI";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
  onReset: () => void;
}

const FilterContainer = styled.section`
  display: grid;
  grid-template-columns: minmax(220px, 2fr) repeat(2, minmax(140px, 1fr)) auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function TaskFilters({ filters, onChange, onReset }: TaskFiltersProps) {
  return (
    <FilterContainer aria-label="Task filters">
      <FilterField>
        <FilterLabel htmlFor="task-search">Search</FilterLabel>
        <Input
          id="task-search"
          type="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
        />
      </FilterField>

      <FilterField>
        <FilterLabel htmlFor="status-filter">Status</FilterLabel>
        <Select
          id="status-filter"
          value={filters.status}
          onChange={e =>
            onChange({
              ...filters,
              status: e.target.value as StatusFilter,
            })
          }
        >
          <option value="ALL">All statuses</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
      </FilterField>

      <FilterField>
        <FilterLabel htmlFor="priority-filter">Priority</FilterLabel>
        <Select
          id="priority-filter"
          value={filters.priority}
          onChange={e =>
            onChange({
              ...filters,
              priority: e.target.value as PriorityFilter,
            })
          }
        >
          <option value="ALL">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </FilterField>

      <Button type="button" onClick={onReset}>
        Clear filters
      </Button>
    </FilterContainer>
  );
}
