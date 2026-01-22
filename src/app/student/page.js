'use client';
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '@/components/Navbar';

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  padding-top: 6rem;
  padding-bottom: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #111827, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
`;

const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #60a5fa, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
  }
  
  h2 {
    font-size: 1.875rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: #6b7280;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    
    @media (min-width: 768px) {
      justify-content: flex-start;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.8);
  }
  
  .value {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  &.blue {
    border-left: 4px solid #3b82f6;
    .value { color: #1d4ed8; }
    .label { color: #3b82f6; }
  }
  
  &.green {
    border-left: 4px solid #22c55e;
    .value { color: #15803d; }
    .label { color: #22c55e; }
  }
  
  &.yellow {
    border-left: 4px solid #eab308;
    .value { color: #a16207; }
    .label { color: #eab308; }
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
  filter: blur(64px);
  opacity: 0.7;
  z-index: -10;
  animation: ${blobAnimation} 10s infinite;
  mix-blend-mode: multiply;
  
  &.blob-1 {
    top: -10%;
    left: 40%;
    width: 30rem;
    height: 30rem;
    background-color: rgba(216, 180, 254, 0.3);
  }
  
  &.blob-2 {
    bottom: -10%;
    right: -5%;
    width: 24rem;
    height: 24rem;
    background-color: rgba(186, 230, 253, 0.3);
    animation-delay: 2s;
  }
`;

export default function StudentDashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Placeholder data calculation
    const attendancePercentage = 85;
    const status = attendancePercentage > 75 ? 'Good' : 'At Risk';
    const pendingAlerts = 0;

    return (
        <PageWrapper>
            <Navbar />

            <ContentContainer>
                <Title>Student Dashboard</Title>

                {user && (
                    <>
                        <ProfileCard>
                            <Avatar>{user.name.charAt(0)}</Avatar>
                            <UserInfo>
                                <h2>{user.name}</h2>
                                <p>
                                    <span>{user.studentId}</span>
                                    <span>•</span>
                                    <span>{user.department || 'General Science'}</span>
                                </p>
                            </UserInfo>
                        </ProfileCard>

                        <StatsGrid>
                            <StatCard className="blue">
                                <div className="value">{attendancePercentage}%</div>
                                <div className="label">Total Attendance</div>
                            </StatCard>

                            <StatCard className="green">
                                <div className="value">{status}</div>
                                <div className="label">Current Status</div>
                            </StatCard>

                            <StatCard className="yellow">
                                <div className="value">{pendingAlerts}</div>
                                <div className="label">Pending Alerts</div>
                            </StatCard>
                        </StatsGrid>
                    </>
                )}
            </ContentContainer>

            <BackgroundBlob className="blob-1" />
            <BackgroundBlob className="blob-2" />
        </PageWrapper>
    );
}
