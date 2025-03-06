import { useEffect, useState } from 'react';
import api from '@/services/api'; // Adjust the import based on your project structure

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const validateToken = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      console.log("Token not found");
      return;
    }

    try {
      const response = await api.post('/validate-token/', { token });
      setIsAuthenticated(response.data.valid);
    } catch (error) {
      setIsAuthenticated(false);
      console.log("Token validation failed:", error);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return { isAuthenticated, validateToken };
};

export default useAuth;