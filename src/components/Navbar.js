'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: ${props => props.$scrolled ? '1rem 0' : '1.5rem 0'};
  background: ${props => props.$scrolled ? 'rgba(255, 255, 255, 0.7)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(12px)' : 'none'};
  box-shadow: ${props => props.$scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.3s ease;
  border-bottom: ${props => props.$scrolled ? '1px solid rgba(255, 255, 255, 0.3)' : 'transparent'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
`;

const BrandText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #1f2937, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserInfo = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    text-align: right;
  }
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #ef4444;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);

  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <Nav $scrolled={scrolled}>
      <Container>
        <Brand onClick={() => router.push('/')}>
          <LogoIcon>A</LogoIcon>
          <BrandText>Attendance System</BrandText>
        </Brand>

        <UserSection>
          <UserInfo>
            <UserName>{user.name}</UserName>
            <UserRole>{user.role}</UserRole>
          </UserInfo>

          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </UserSection>
      </Container>
    </Nav>
  );
}
