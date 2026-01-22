'use client';
import { useState, useRef } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
`;

const MessageBox = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  background-color: ${props => props.$isError ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$isError ? '#dc2626' : '#166534'};
  display: flex;
  align-items: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    background-color: white;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    background-color: white;
  }
`;

const StudentDetailsSection = styled.div`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(243, 244, 246, 0.5);
  border: 1px dashed #d1d5db;
  border-radius: 1rem;
`;

const StudentDetailsTitle = styled.h3`
  margin-bottom: 1rem;
  font-weight: 700;
  color: #4b5563;
  font-size: 1rem;
`;

const FileInputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  
  ${props => props.$secondary ? `
    background-color: white;
    color: #4b5563;
    border-color: #d1d5db;
    &:hover { background-color: #f3f4f6; }
  ` : `
    background-color: #4f46e5;
    color: white;
    &:hover { background-color: #4338ca; }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CameraWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  background: black;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  color: white;
  background: linear-gradient(to right, #10b981, #059669);
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -1px rgba(16, 185, 129, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: wait;
    transform: none;
  }
`;

const Video = styled.video`
  width: 100%;
  display: block;
`;

export default function UserRegistrationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
    department: '',
    year: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Camera additions
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setShowCamera(false);
  };

  const startCamera = async () => {
    setShowCamera(true);
    setFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 480);

      canvasRef.current.toBlob((blob) => {
        const capturedFile = new File([blob], "live-capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);

        // Stop camera
        const stream = videoRef.current.srcObject;
        if (stream) stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }, 'image/jpeg');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const registerData = await registerRes.json();

      if (!registerData.success) throw new Error(registerData.error);

      if (formData.role === 'student' && file) {
        const faceData = new FormData();
        faceData.append('image', file);
        faceData.append('studentId', formData.studentId);

        const faceRes = await fetch('/api/face/register', {
          method: 'POST',
          body: faceData
        });
        const faceResult = await faceRes.json();

        if (!faceResult.success) {
          setMessage(`User created, but face registration failed: ${faceResult.error}`);
          setLoading(false);
          return;
        }
      }

      setMessage('User registered successfully!');
      if (onSuccess) onSuccess();
      setFormData({
        name: '', email: '', password: '', role: 'student',
        studentId: '', department: '', year: ''
      });
      setFile(null);
      setShowCamera(false);

    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Register New User</FormTitle>
      {message && (
        <MessageBox $isError={message.includes('Error') || message.includes('failed')}>
          {message}
        </MessageBox>
      )}

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormInput name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <FormInput name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <FormInput name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <FormSelect name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </FormSelect>
        </FormGrid>

        {formData.role === 'student' && (
          <StudentDetailsSection>
            <StudentDetailsTitle>Student Details</StudentDetailsTitle>
            <FormGrid>
              <FormInput name="studentId" placeholder="Student ID" value={formData.studentId} onChange={handleChange} required />
              <FormInput name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
              <FormInput name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} />
            </FormGrid>

            <div>
              <FileInputLabel>Face Photo (Required for Attendance)</FileInputLabel>

              <ButtonGroup>
                <ActionButton type="button" $secondary onClick={() => document.getElementById('fileUpload').click()}>
                  📁 Upload File
                </ActionButton>
                <ActionButton type="button" onClick={startCamera}>
                  📸 Take Live Photo
                </ActionButton>
              </ButtonGroup>

              <input
                id="fileUpload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
              />

              {showCamera && (
                <CameraWrapper>
                  <Video ref={videoRef} autoPlay playsInline muted />
                  <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
                  <div style={{ padding: '10px', textAlign: 'center' }}>
                    <ActionButton type="button" onClick={capturePhoto}>
                      Capture & Save
                    </ActionButton>
                  </div>
                </CameraWrapper>
              )}

              {file && !showCamera && (
                <div style={{ fontSize: '0.9rem', color: '#16a34a', fontWeight: 'bold' }}>
                  ✅ Photo Selected: {file.name}
                </div>
              )}
            </div>
          </StudentDetailsSection>
        )}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Register User'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}
