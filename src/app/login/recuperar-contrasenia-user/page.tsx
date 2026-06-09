"use client";
import { recuperarContraseniaUser } from '../services/passUsersRecoverActions';
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { recuperarContrasenia } from '../services/passRecoverActions';
import FormularioPass from '../components/FormPassword';
import Instrucciones from '../components/Instrucciones';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Index = () => {
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);
  const [instrucciones, setInstrucciones] = useState<boolean>(false); // Inicialmente false para mostrar FormularioPass
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setUsernameError(false);
  };

  const handleSubmit = async () => {
    if (email.trim() === "") {
      setUsernameError(true);
      setErrorMessage("Por favor, ingresa un correo electrónico.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setUsernameError(true);
      setErrorMessage("Correo electrónico inválido.");
      return;
    }
  
    try {
      const response = await recuperarContraseniaUser({ email });
  
      if (response) {
        console.log("Respuesta:", response);
  
        if (response.success) {
          setInstrucciones(true); // Muestra instrucciones si el correo se envió correctamente
        } else {
          // Aquí mostramos el mensaje específico del backend si el correo no se envió
          setErrorMessage(response.message || "Error inesperado.");
          setUsernameError(true);
        }
      } else {
        setErrorMessage(`Error al enviar el correo a ${email}.`);
        setUsernameError(true);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Error inesperado al enviar el correo.");
      setUsernameError(true);
    }
  };
  
  
  
  

  const Navigate = () => {
    router.push("/login");
  };

  const handleNavigate = () => {
    setInstrucciones(false); 
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {!instrucciones ? (
        <FormularioPass 
          email={email} 
          handleSubmit={handleSubmit} 
          invalidCredentials={invalidCredentials} 
          handleChanges={handleChanges}
          error={usernameError}
          errorMessage={errorMessage}
        />
      ) : (
        <Instrucciones Navigate={Navigate} handleNavigate={handleNavigate}/>
      )}
    </Grid>
  )
}

export default Index
