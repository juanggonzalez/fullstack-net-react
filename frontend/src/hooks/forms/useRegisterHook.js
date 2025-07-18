import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/auth/authSlice';
import { registrationSchema } from '../../utils/validations/loginValidationSchemas'; 

const useRegisterHook = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);


  const {
    register: registerForm, 
    handleSubmit,
    formState: { errors, isSubmitting },
    reset 
  } = useForm({
    resolver: yupResolver(registrationSchema), 
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data) => {
    dispatch(register(data)); 
  };

  return {
    registerForm,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: isSubmitting || status === 'loading',
    reset,
  };
};

export default useRegisterHook;