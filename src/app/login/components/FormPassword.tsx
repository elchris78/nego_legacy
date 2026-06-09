'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Label } from '@/components/ui/label';

import Loading from '@/Modals/LoadingModal'
import { 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  InputAdornment, 
  IconButton, 
  Link as MuiLink,
  ThemeProvider,
  createTheme,
  Alert,
  Box,
  Container
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { Input } from '@/components/ui/input';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

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

interface IRecuperarContrasenia {
    email: string;
    invalidCredentials: boolean;
    handleSubmit: () => void;
    handleChanges: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    errorMessage?: string;
}

const FormularioPass: React.FC <IRecuperarContrasenia> = ({email, invalidCredentials, handleSubmit, handleChanges, error, errorMessage}) => {
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

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ bgcolor: 'white', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', order: { xs: 2, md: 1 } }}>
              <Typography variant="h4" component="h2" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4, textAlign: 'start' }}>
                Recuperar contraseña
              </Typography>
              <Typography>
                Escribe tu correo electrónico y te enviaremos un mensaje con las instrucciones para recuperar tu contraseña.
              </Typography>
              <form onSubmit={handleSubmit} autoComplete="off">
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} paddingBlock={6} display={'flex'} flexDirection={'column'}>
                            <Label className='font-bold text-xl'>Email</Label>
                            <Input
                                onChange={handleChanges}
                                value={email}
                                placeholder='Ingresar correo electrónico'
                                style={{ backgroundColor: 'white', padding: '12px', fontSize: '1rem', height: '50px', border: error ? '2px solid #DA0E0E' : undefined  }}

                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end"> 
                                        <MailOutlineIcon color="action" />
                                    </InputAdornment>
                                    ),
                                }}
                             />
                             {error && (
                                <p className="text-[#DA0E0E] text-sm ml-2 mt-1">{errorMessage}</p>
                              )}
                        </Grid>
                        <Grid item xs={12} paddingBlock={3}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: '#329FD8',
                                    color: 'white',
                                    '&:hover': {
                                    backgroundColor: '#2980B9',
                                    },
                                    padding: '10px',
                                    fontSize: '1rem',
                                }}
                                onClick={handleSubmit}
                        >
                                Enviar instrucciones
                            </Button>
                        </Grid>
                    </Grid>
                    
                
              </form>
              {invalidCredentials && (
                <Alert 
                  severity="error" 
                  icon={<Warning />}
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    bgcolor: 'error.main',
                    color: 'white'
                  }}
                >
                  Error. Las credenciales de acceso ingresadas son incorrectas.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
        </Container>
    </ThemeProvider>
  )
}

export default FormularioPass
