'use client';
import styled, { keyframes } from 'styled-components';
import Navbar from '@/components/Navbar';
import LiveAttendance from '@/components/LiveAttendance';

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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const TitleSection = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #111827, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const StatusBadge = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4f46e5;
  background-color: #eef2ff;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #e0e7ff;
  white-space: nowrap;
  
  span {
    color: #16a34a;
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
    left: -10%;
    width: 24rem;
    height: 24rem;
    background-color: rgba(216, 180, 254, 0.3);
  }
  
  &.blob-2 {
    top: -10%;
    right: -10%;
    width: 24rem;
    height: 24rem;
    background-color: rgba(199, 210, 254, 0.3);
    animation-delay: 2s;
  }
  
  &.blob-3 {
    bottom: -20%;
    left: 20%;
    width: 24rem;
    height: 24rem;
    background-color: rgba(251, 207, 232, 0.3);
    animation-delay: 4s;
  }
`;

export default function TeacherDashboard() {
    return (
        <PageWrapper>
            <Navbar />

            <ContentContainer>
                <Header>
                    <TitleSection>
                        <Title>Classroom Dashboard</Title>
                        <Subtitle>
                            Manage live sessions and monitor student attendance in real-time.
                        </Subtitle>
                    </TitleSection>
                    <StatusBadge>
                        System Status: <span>● Active</span>
                    </StatusBadge>
                </Header>

                <LiveAttendance />
            </ContentContainer>

            <BackgroundBlob className="blob-1" />
            <BackgroundBlob className="blob-2" />
            <BackgroundBlob className="blob-3" />
        </PageWrapper>
    );
}
