import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserHelp = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  return (
    <div style={{ padding: '120px 20px 60px', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Help & Support</h1>
        <p style={{ color: '#6b7280', marginBottom: '40px' }}>Get assistance and find answers to your questions</p>
        
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
          <h3 style={{ marginBottom: '10px' }}>Help Center Coming Soon</h3>
          <p>FAQs, tutorials, and support resources will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default UserHelp; 