import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = (redirectTo = '/') => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate(redirectTo);
      }, 1500); 

      return () => clearTimeout(timer); 
    }
  }, [isAuthenticated, navigate, redirectTo]);
};

export default useAuthRedirect;