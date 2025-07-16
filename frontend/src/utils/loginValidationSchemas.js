import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().required('El nombre de usuario es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

export const registrationSchema = yup.object().shape({
  username: yup.string().required('El nombre de usuario es requerido').min(4, 'Mínimo 4 caracteres'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});