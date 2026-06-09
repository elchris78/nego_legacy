import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Container,
  ThemeProvider,
  createTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useRouter } from 'next/navigation';

const theme = createTheme({
    palette: {
      primary: {
        main: '#3C98CB',
      },
      error: {
        main: '#CF5459',
      },
    },
  });

const Confirmacion = () => {

    const route = useRouter();
    const handleLogin = () => {
        route.push('/login')
    } 

  return (

    <ThemeProvider theme={theme}>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 0 } }}>
        <Paper elevation={5} sx={{ width: '100%', maxWidth: '1000px', height: { xs: 'auto', md: '500px' }, overflow: 'hidden' }}>
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 0 }, order: { xs: 1, md: 2 } }}>
              <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
                NEGO
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ bgcolor: 'white', p: 4, display: 'flex', flexDirection: 'column' }}>
                <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                    <CheckCircleIcon sx={{ border: "4px solid #3C98CB", borderRadius: "50%", color:"#88DC65", fontSize:'50px' }} />
                </Box>
              <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography variant='h4' textAlign={'center'}  paddingTop={5} fontWeight={500} color='#3C98CB'>
                                    ¡Tu contraseña ha sido restablecida de forma exitosa!
                                </Typography>
                                
                            </Grid>


                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant='subtitle1' textAlign={'center'} fontWeight={500}>
                                Ahora puedes iniciar sesión:
                            </Typography>
                            
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} paddingBlock={7} >
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
                                    onClick={handleLogin}
                                >
                                    Ir a iniciar sesión
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
              </Box>
              
            </Grid>
          </Grid>
        </Paper>
        </Container>
    </ThemeProvider>

  )
}

export default Confirmacion






