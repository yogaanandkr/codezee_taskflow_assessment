import styled from "styled-components";

const Container = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TaskPanel = styled.section`
  padding: 40px;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

export default function App() {
  return (
    <Container>
      <Header>
        <div>
          <Heading>TaskFlow</Heading>
          <Description>Manage your work, one task at a time.</Description>
        </div>
      </Header>

      <TaskPanel>
        <h2>No tasks yet</h2>
        <Description>Task management features are coming soon.</Description>
      </TaskPanel>
    </Container>
  );
}
