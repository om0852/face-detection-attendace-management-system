'use client';
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '@/components/Navbar';
import UserRegistrationForm from '@/components/UserRegistrationForm';

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 6rem;
  padding-bottom: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #111827, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const FormSection = styled.div`
  margin-bottom: 3rem;
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const TableTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CountBadge = styled.span`
  background-color: #e0e7ff;
  color: #4338ca;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
`;

const StyledTable = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.5);
`;

const TableHead = styled.thead`
  tr {
    background-color: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #4b5563;
  font-size: 0.95rem;
  vertical-align: middle;
  
  &:first-child {
    font-weight: 600;
    color: #1f2937;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  
  ${props => props.$registered ? `
    color: #15803d;
    background-color: #dcfce7;
    border: 1px solid #bbf7d0;
  ` : `
    color: #b45309;
    background-color: #fef3c7;
    border: 1px solid #fde68a;
  `}
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #dc2626;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #fecaca;
    color: #b91c1c;
  }
`;

const blobAnimation = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

const BackgroundBlob = styled.div`
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.6;
  z-index: 0;
  animation: ${blobAnimation} 12s infinite;
  mix-blend-mode: multiply;
  pointer-events: none;
  
  &.blob-1 {
    top: -10%;
    right: -10%;
    width: 40rem;
    height: 40rem;
    background-color: rgba(199, 210, 254, 0.3); // indigo
  }
  
  &.blob-2 {
    bottom: -10%;
    left: -10%;
    width: 35rem;
    height: 35rem;
    background-color: rgba(253, 186, 116, 0.3); // orange
    animation-delay: 3s;
  }
`;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (data.success) {
      setUsers(data.data);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        // Refresh list
        fetchUsers();
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (error) {
      alert("Error deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <PageContainer>
      <Navbar />

      <ContentWrapper>
        <Header>
          <PageTitle>System Administration</PageTitle>
          <Subtitle>Manage users and registration status.</Subtitle>
        </Header>

        <FormSection>
          <UserRegistrationForm onSuccess={fetchUsers} />
        </FormSection>

        <TableContainer>
          <TableTitle>
            System Users
            <CountBadge>{users.length}</CountBadge>
          </TableTitle>
          <TableWrapper>
            <StyledTable>
              <TableHead>
                <tr>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Student ID</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <tr key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell style={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
                    <TableCell>{user.studentId || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge $registered={user.isFaceRegistered}>
                        {user.isFaceRegistered ? 'Registered' : 'Pending'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <DeleteButton onClick={() => handleDelete(user._id, user.name)}>
                        Delete
                      </DeleteButton>
                    </TableCell>
                  </tr>
                ))}
              </TableBody>
            </StyledTable>
          </TableWrapper>
        </TableContainer>
      </ContentWrapper>

      <BackgroundBlob className="blob-1" />
      <BackgroundBlob className="blob-2" />
    </PageContainer>
  );
}
