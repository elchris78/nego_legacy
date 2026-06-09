import React from 'react';
import { Modal, Box } from '@mui/material';
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

const Loading: React.FC = () => {
  return (
    <div style={{ overflow: 'auto' }}>
      <Box sx={modalStyle}>
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

export default Loading;
