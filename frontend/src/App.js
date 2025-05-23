// src/App.js
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api/axios';
import React, { useEffect } from 'react';

function SessionCheck() {
  const navigate = useNavigate();

  useEffect(() => {
   const checkSession = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('NO_TOKEN');
        }
        
        await api.get('/api/validate-session');
      } catch (err) {
        handleSessionError(err);
      }
    };

   const handleSessionError = (error) => {
      console.error('Session validation failed:', error);
      if (error.message !== 'NO_TOKEN') {
        localStorage.clear();
      }
      navigate('/login', { 
        replace: true,
        state: { sessionExpired: error.message === 'SESSION_EXPIRED' } 
      });
    };

    // Add global error handler for API calls
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.message === 'SESSION_EXPIRED') {
          handleSessionError(error);
        }
        return Promise.reject(error instanceof Error ? error : new Error(error));
      }
    );

    if (localStorage.getItem('accessToken')) {
      checkSession();
    }

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SessionCheck />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;