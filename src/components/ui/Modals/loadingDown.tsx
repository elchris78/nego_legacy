import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ReactLoading from 'react-loading';

const isInverted = false;

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#778199',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1300,
};

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const LoadingDown: React.FC = () => {
  // Estado para verificar si estamos en un dispositivo móvil
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // Solo en el cliente, obtenemos el tamaño de la ventana
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth); // Inicializa el ancho de la ventana
    }

    // Actualizar el tamaño de la ventana cuando cambie el tamaño
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Agregar el evento de cambio de tamaño de ventana
    window.addEventListener('resize', handleResize);

    // Limpiar el evento al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determina el paddingInlineStart en base al tamaño de la ventana
  const getPaddingInlineStart = () => {
    if (windowWidth <= 320) return 0;
    if (windowWidth <= 375) return 8;
    if (windowWidth <= 425) return 12;
    if (windowWidth <= 768) return 35;
    return 0; // Valor por defecto si no se cumple ninguna condición
  };

  const customModalStyle = {
    ...modalStyle,
    justifyContent: windowWidth < 768 ? 'start' : 'center',
    alignItems: windowWidth < 768 ? 'start' : 'center',
    paddingTop: windowWidth < 768 ? 50 : 0,
    paddingInlineStart: getPaddingInlineStart(), // Aquí se usa la función para determinar el padding
  };

  return (
    <div style={{ overflow: 'auto' }}>
      <Box sx={customModalStyle}>
        <Box sx={loaderStyle}>
          <ReactLoading
            type="spinningBubbles"
            color={isInverted ? '#3b82f6' : '#ffffff'}
            width={200}
          />
          <div style={{ color: isInverted ? '#3b82f6' : '#ffffff', marginTop: '10px' }}>
            Cargando...
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default LoadingDown;
