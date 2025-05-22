// src/components/AxiosNavigator.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '../api/axios';

const AxiosNavigator = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    setNavigate(navigate);
    
    return () => {
      setNavigate(null);
    };
  }, [navigate]);

  return null;
};

export default AxiosNavigator;