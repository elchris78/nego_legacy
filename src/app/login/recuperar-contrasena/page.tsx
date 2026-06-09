"use client";
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
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
      const response = await recuperarContrasenia({ email });
  
      if (response) {
        console.log("Respuesta:", response);
  
        if (response.success) {
          setInstrucciones(true); // Muestra instrucciones si el correo se envió correctamente
        } else {
          // Extraemos solo el mensaje del error de la respuesta del backend
          const errorMessage = response.message || "Error inesperado."; 
          setErrorMessage(`Error: ${errorMessage}`);
          setUsernameError(true);
        }
      } else {
        setErrorMessage(`Error al enviar el correo a ${email}.`);
        setUsernameError(true);
      }
    } catch (error) {
      // En caso de un error inesperado (por ejemplo, problemas de red)
      setErrorMessage("Error inesperado al enviar el correo.");
      setUsernameError(true);
      console.error("Error inesperado:", error);
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
  );
};

export default Index;
