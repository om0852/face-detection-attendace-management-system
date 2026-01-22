'use client';
import { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.2s;
  color: #1f2937;
  
  &:focus {
    box-shadow: 0 0 0 2px #6366f1;
    background-color: white;
  }
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  color: white;
  background: ${props => props.$active
        ? 'linear-gradient(to right, #ef4444, #db2777)'
        : 'linear-gradient(to right, #6366f1, #9333ea)'};
  box-shadow: 0 4px 6px -1px ${props => props.$active
        ? 'rgba(239, 68, 68, 0.3)'
        : 'rgba(99, 102, 241, 0.3)'};
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const VideoContainer = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background-color: #111827;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
`;

const Overlay = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }
`;

const LiveBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background-color: rgba(239, 68, 68, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  border: 1px solid rgba(248, 113, 113, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  background-color: white;
  border-radius: 9999px;
`;

const FeedbackOverlay = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  text-align: center;
`;

const FeedbackCard = styled.div`
  padding: 0.75rem 1.5rem;
  background-color: rgba(34, 197, 94, 0.9);
  backdrop-filter: blur(4px);
  color: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(74, 222, 128, 0.5);
`;

const SidebarTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
  }
`;

const CountBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: #e0e7ff;
  color: #4338ca;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const StudentList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: 500px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 2px;
  }
`;

const StudentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 0.75rem;
  border: 1px solid #f3f4f6;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(to top right, #60a5fa, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const StudentInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  p.name {
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  p.id {
    font-size: 0.75rem;
    color: #6b7280;
    font-family: monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StatusDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
`;

export default function LiveAttendance() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [session, setSession] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [markedStudents, setMarkedStudents] = useState([]);
    const [recentMatch, setRecentMatch] = useState(null);
    const intervalRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            alert("Could not access webcam.");
        }
    };

    const captureAndCheck = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 640, 480);

        canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;

            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');
            formData.append('session', session);

            try {
                const res = await fetch('/api/attendance/mark', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (data.success && data.matches > 0) {
                    setMarkedStudents(prev => {
                        const newStudents = data.marked.filter(
                            newS => !prev.some(p => p.studentId === newS.studentId)
                        );
                        return [...newStudents, ...prev];
                    });
                    setRecentMatch(`Identified: ${data.marked.map(s => s.name).join(', ')}`);
                    setTimeout(() => setRecentMatch(null), 3000);
                }
            } catch (error) {
                console.error("Recognition check failed", error);
            }

        }, 'image/jpeg');
    };

    const toggleSession = () => {
        if (isSessionActive) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsSessionActive(false);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        } else {
            if (!session) return alert("Please enter a Session Name first (e.g., Math-101)");
            startCamera();
            setIsSessionActive(true);
            intervalRef.current = setInterval(captureAndCheck, 5000);
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Container>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <GlassCard>
                    <ControlsContainer>
                        <Input
                            placeholder="Enter Session Name (e.g., Physics-101)"
                            value={session}
                            onChange={(e) => setSession(e.target.value)}
                            disabled={isSessionActive}
                        />
                        <Button
                            onClick={toggleSession}
                            $active={isSessionActive}
                        >
                            {isSessionActive ? 'Stop Session' : 'Start Session'}
                        </Button>
                    </ControlsContainer>

                    <VideoContainer>
                        <Video ref={videoRef} autoPlay playsInline muted />
                        <canvas ref={canvasRef} width="640" height="480" className="hidden" />

                        {!isSessionActive && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                                <div style={{ textAlign: 'center', color: 'white' }}>
                                    <p style={{ fontWeight: 500, fontSize: '1.125rem' }}>Camera is off</p>
                                </div>
                            </div>
                        )}

                        {isSessionActive && (
                            <Overlay>
                                <LiveBadge>
                                    <Dot /> LIVE
                                </LiveBadge>
                            </Overlay>
                        )}

                        {recentMatch && (
                            <FeedbackOverlay>
                                <FeedbackCard>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.125rem', display: 'block' }}>Match Found!</span>
                                    <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>{recentMatch.replace('Identified: ', '')}</span>
                                </FeedbackCard>
                            </FeedbackOverlay>
                        )}
                    </VideoContainer>
                </GlassCard>
            </div>

            <GlassCard style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <SidebarTitle>
                    <h2>Attendance Log</h2>
                    <CountBadge>
                        Total: {markedStudents.length}
                    </CountBadge>
                </SidebarTitle>

                <StudentList>
                    {markedStudents.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2.5rem 0' }}>
                            <p>No students marked yet.</p>
                        </div>
                    ) : (
                        markedStudents.map((s, idx) => (
                            <StudentItem key={`${s.studentId}-${idx}`}>
                                <Avatar>
                                    {s.name.charAt(0)}
                                </Avatar>
                                <StudentInfo>
                                    <p className="name">{s.name}</p>
                                    <p className="id">{s.studentId}</p>
                                </StudentInfo>
                                <StatusDot />
                            </StudentItem>
                        ))
                    )}
                </StudentList>
            </GlassCard>
        </Container>
    );
}
