'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Grid } from '@mui/material';
import FormularioNuevaPass from '@/app/login/components/FormNewPass';
import Confirmacion from '@/app/login/components/Confirmacion';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const NuevaContrasenia = () => {
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mensageError, setmensageError] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  

  const searchParams = typeof window !== 'undefined' ? useSearchParams() : null;

  
useEffect(() => {
  if (searchParams) {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    const decodedToken = urlToken ? decodeURIComponent(urlToken) : '';
    const decodedEmail = urlEmail ? decodeURIComponent(urlEmail) : '';

    console.log("Token decodificado:", decodedToken); 
    console.log("Email extraído:", decodedEmail); 

    setToken(decodedToken);
    setEmail(decodedEmail); 
  }
}, [searchParams]);
  

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (e.target.name === 'password') {
      setPassword(value);
      validatePassword(value);
    } else if (e.target.name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };
  
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.])(?=.*[0-9])(?=.{6,})/;
    setIsPasswordValid(passwordRegex.test(password));
    if (!passwordRegex.test(password)) {
      console.log('La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.');
    }
  };
  
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async () => {
    if(password.length < 6){
      setPasswordError(true);
      setmensageError('La contraseña debe de ser mayor de 6 caracteres.')
      console.log('Error: La contraseña debe de ser mayor de 6 caracteres.'); 
      return
    }
    else if(confirmPassword.length < 6){
      setPasswordError(true);
      setmensageError('Las contraseñas no coinciden.')
      console.log('Error: Las contraseñas no coinciden.'); 
      return
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      setmensageError('Las contraseñas no coinciden.')
      console.log('Error: Las contraseñas no coinciden.');
    } else if (!isPasswordValid) {
      setPasswordError(true)
      setmensageError('La contraseña no cumple con los requisitos (una mayúscula, un número, un carácter especial).')
      console.log('La contraseña no cumple con los requisitos (al menos 6 caracteres, una mayúscula, un número, un carácter especial).');
    } else {
      setPasswordError(false);
      setmensageError('');
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/reset-password`,
          {
            token,
            email,
            password,
          }
        );
  
        if (response.status === 200) {
          console.log('Contraseña cambiada con éxito.');
          setShowConfirmation(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña';
          console.error('Error al cambiar la contraseña:', errorMessage);
          setPasswordError(true);
          setmensageError(errorMessage);
        } else {
          console.error('Error al cambiar la contraseña:', error);
          setPasswordError(true);
          setmensageError('Ha ocurrido un error inesperado.');
        }
      }
    }
  };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        {showConfirmation ? (
          <Confirmacion />
        ) : (
          <FormularioNuevaPass
            pass={password} 
            newPass={confirmPassword}
            handleChanges={handleChanges}
            handleSubmit={handleSubmit}
            passwordError={passwordError}
            togglePasswordVisibility={handleTogglePasswordVisibility}
            showPassword={showPassword}
            handleToggleConfirmPasswordVisibility={handleToggleConfirmPasswordVisibility}
            showConfirmPassword={showConfirmPassword}
            mensageError={mensageError}
          />
        )}
      </Grid>
    </Suspense>
  );
  
};

export default NuevaContrasenia;
