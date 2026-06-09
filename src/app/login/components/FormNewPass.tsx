import React, { useState } from 'react';
import { 
  Grid,
  Box,
  Typography,
  Button,
  createTheme,
  IconButton,
  ThemeProvider,
  Container,
  Paper
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Warning } from '@mui/icons-material';

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

interface INuevaPass {
    pass: string;
    newPass: string;
    passwordError: boolean;
    handleSubmit: () => void;
    handleChanges: (e: React.ChangeEvent<HTMLInputElement>) => void;
    togglePasswordVisibility: () => void;
    showPassword: boolean; 
    handleToggleConfirmPasswordVisibility: () => void;
    showConfirmPassword: boolean;
    mensageError: string;
}

const FormNewPass: React.FC<INuevaPass> = ({pass, newPass ,handleChanges,handleSubmit,passwordError, togglePasswordVisibility, showPassword, handleToggleConfirmPasswordVisibility, showConfirmPassword, mensageError}) => {
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
              <Typography variant="h4" component="h2" sx={{ color: 'primary.main', fontWeight: 500, mb: 4, textAlign: 'start' }}>
                Crear nueva contraseña
              </Typography>
              <Box>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography variant='subtitle1' fontWeight={500}>Nueva contraseña</Typography>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        backgroundColor: 'white', 
                                        borderRadius: '4px',
                                        padding: '0 8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={handleChanges}
                                        value={pass}
                                        name='password'
                                        placeholder='Ingresar nueva contraseña'
                                        style={{ 
                                            backgroundColor: 'white',
                                            flex: 1, 
                                            padding: '12px', 
                                            fontSize: '1rem', 
                                            outline: 'none',
                                            border: passwordError ? '2px solid #DA0E0E' : undefined,
                                        }}
                                    />
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOffOutlinedIcon />
                                        ) : (
                                            <VisibilityOutlinedIcon />
                                        )}
                                    </IconButton>
                                </Box>
                            </Grid>


                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant='subtitle1' fontWeight={500}>Confirmar contraseña</Typography>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    backgroundColor: 'white', 
                                    borderRadius: '4px',
                                    padding: '0 8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onChange={handleChanges}
                                    value={newPass}
                                    name='confirmPassword'
                                    placeholder='Confirmar nueva contraseña'
                                    style={{ 
                                        backgroundColor: 'white',
                                        flex: 1, 
                                        padding: '12px', 
                                        fontSize: '1rem', 
                                        border: passwordError ? '2px solid #DA0E0E' : undefined,
                                        outline: 'none',
                                    }}
                                />
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleToggleConfirmPasswordVisibility}
                                    edge="end"
                                >
                                    {showConfirmPassword ? (
                                        <VisibilityOffOutlinedIcon />
                                    ) : (
                                        <VisibilityOutlinedIcon />
                                    )}
                                </IconButton>
                            </Box>
                                {passwordError && (
                                <p className="text-[#DA0E0E] text-sm ml-2 mt-1">{mensageError}</p>
                                )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} paddingTop={5}>
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
                                    onClick={handleSubmit}
                                >
                                    Reestablecer contraseña
                                </Button>
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

export default FormNewPass
