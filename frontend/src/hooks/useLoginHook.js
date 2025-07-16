import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { showNotification } from '../features/notifications/notificationsSlice';
import { loginSchema } from '../utils/loginValidationSchemas'; 

const useLoginHook = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    dispatch(login(data));
  };

  const showLocalWarning = (message) => {
    dispatch(showNotification({
      message: message,
      severity: 'warning',
      duration: 4000
    }));
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit), 
    errors,
    isSubmitting: isSubmitting || status === 'loading',
    showLocalWarning 
  };
};

export default useLoginHook;