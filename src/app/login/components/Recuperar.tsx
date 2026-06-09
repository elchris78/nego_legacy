import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
} from '@mui/material';

interface IRecuperar {
    newpass: () => void;
}

const Recuperar: React.FC <IRecuperar> = ({newpass}) => {
  return (
<Grid item xs={11} sm={10} md={10} lg={9} xl={6}>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
            }}
            
            >
                <Box 
                    display={'flex'} 
                    justifyContent={'center'} 
                    alignItems={'center'} 
                    width={'25%'} 
                    height={'10vh'} 
                    sx={{
                        border: '1px solid #329FD8',
                        borderRadius: '4px',
                    }
                }>

                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            color: '#329FD8',
                            fontWeight: 'bold',
                        }}
                    >
                        NEGO
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ color: '#329FD8', fontWeight: 400 }}
                >
                    Recuperar contraseña
                </Typography>
            </Box>

            <Box
                sx={{
                    backgroundColor: '#E0F4FF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                display={'flex'}
                justifyContent={'center'}

            >
                <Box display={'flex'}  justifyContent={'center'} alignContent={'center'} >
                    <Grid item xs={10} sm={10} md={9} lg={9} xl={9}  width={'100%'}>
                        <Grid container  display={'flex'}  paddingBlock={5}>
                            <Grid item xs={12} sm={12} md={12} lg={10} xl={11} paddingBlock={5}>
                                <Typography fontSize={{sx:'15px', sm:'20px', md:'20px', lg:'25px', xl:'30px' }} align="left" >
                                    ¡Hola Daniel!
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={10} xl={11} paddingBlock={5}>
                                <Typography fontSize={{sx:'15px', sm:'20px', md:'20px', lg:'25px', xl:'30px' }} align="left" >
                                    Para recuperar tu contraseña
                                    debes pulsar el siguiente botón:
                                </Typography>
                            </Grid>

                            {/* Campo de Correo Electrónico */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={5} paddingBlock={5} >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#329FD8',
                                        color: 'white',
                                        '&:hover': {
                                        backgroundColor: '#2980B9',
                                        },
                                        padding: '12px',
                                        fontSize: '1rem',
                                    }}
                                    onClick={newpass}
                                >
                                    Recuperar contraseña
                                </Button>
                            </Grid>
                            <Grid  xs={12} sm={12} md={12} lg={12} xl={12} paddingBlock={3}>
                                <Typography className='font-bold' fontSize={{sx:'15px', sm:'20px', md:'20px', lg:'25px', xl:'30px' }} align="left" >
                                    NegoWeb.                                
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box> 
                      
            </Box>
        </Grid>
  )
}

export default Recuperar
