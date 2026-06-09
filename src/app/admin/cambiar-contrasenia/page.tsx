'use client';

import { NavBar2 } from '@/components/layout/menus/Nav';
import { Box, Button, Grid, IconButton, Typography,Tooltip } from '@mui/material';
import React, { useState } from 'react';
import InputText from './components/inputText';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ReactLoading from 'react-loading';
import { changePassword } from './services/passActions';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ToastErrorMsg } from '@/Toast/ToastErrorMsg';
import { ToastSuccessMsg } from '@/Toast/ToastSuccessMsg';
import Link from 'next/link';
import Swal from 'sweetalert2';



const Page = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isToastError, setIsToastError] = useState(false);
    const [isToastSuccess, setIsToastSuccess] = useState(false);
    const [isToastSuccessMsg, setIsToastSuccessMsg] = useState<string>('');
    const [isToastErrorMessage, setIsToastErrorMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        backendError: ''
    });

    const hasUpperCase = (password: string) => {
        return /[A-Z]/.test(password);
    };
    
    const hasDigit = (password: string) => {
        return /\d/.test(password);
    };
    
    const hasSpecialCharacter = (password: string) =>{
        return /[!@#$%^&*.,?]/.test(password);
    };
    
    const hasMinimumLength = (password: string) => {
        return password.length >= 8;
    };

    const formatErrors = (errorString: string | undefined): string => {
        if (!errorString) return '';
        
        if (errorString.includes(',')) {
            const parts = errorString.split(',');
            
            if (parts.length === 2) {
                return `${parts[0].trim()} y ${parts[1].trim()}`;
            } else if (parts.length > 2) {
                const lastPart = parts.pop()!.trim();
                return `${parts.join(',')} y ${lastPart}`;
            }
        }
        return errorString;
    };
    
    
    const isComplete = passwords.oldPassword && passwords.newPassword && passwords.confirmPassword;

    const handleChange = (field: 'oldPassword' | 'newPassword' | 'confirmPassword', value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' })); 
    };

    const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
        setShowPassword(prevState => ({ ...prevState, [field]: !prevState[field] }));
    };

    const validatePasswords = () => {
        let valid = true;
        const newErrors = { oldPassword: '', newPassword: '', confirmPassword: '', backendError: '' };

        if (!passwords.oldPassword) {
            newErrors.oldPassword = 'La contraseña actual es obligatoria.';
            valid = false;
        }

        if (!hasMinimumLength(passwords.newPassword)) {
            newErrors.newPassword = 'La nueva contraseña debe tener 8 caracteres, una mayuscula, un número y un caracter especial.';
            valid = false;
        }
        else if (!hasUpperCase(passwords.newPassword)) {
            newErrors.newPassword = 'La nueva contraseña debe tener 8 caracteres, una mayuscula, un número y un caracter especial.';
            valid = false;
        }
        else if (!hasDigit(passwords.newPassword)) {
            newErrors.newPassword = 'La nueva contraseña debe tener 8 caracteres, una mayuscula, un número y un caracter especial.';
            valid = false;
        }
        if (!hasSpecialCharacter(passwords.newPassword)) {
            newErrors.newPassword = 'La nueva contraseña debe tener 8 caracteres, una mayuscula, un número y un caracter especial.';
            valid = false;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    
    const handleSubmit = async () => {
        setIsLoading(true);
      
        if (!validatePasswords()) {
          setIsLoading(false);
          return;
        }
      
        const { oldPassword, newPassword, confirmPassword } = passwords;
      
        try {
          const result = await changePassword({ oldPassword, newPassword, confirmPassword });
      
          if (result.success) {
            // Limpiar contraseñas y mostrar mensaje de éxito
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
            Swal.fire({
              title: "¡ÉXITO!",
              text: result.message || "La contraseña se ha cambiado exitosamente.",
              icon: "success",
              confirmButtonText: "Cerrar",
              customClass: {
                container: "swal2-container",
                popup: "swal-popup-succes",
                confirmButton: "swal-confirm-button",
                title: "swal-title",
              },
            });
      
          } else {
            throw new Error(result.message);
          }
        } catch (error: any) {
          // Extraer el mensaje de error del backend
          const errorMsg = error.message || "Ocurrió un problema inesperado al cambiar la contraseña.";
      
          setErrors(prev => ({ ...prev, backendError: errorMsg }));
      
          Swal.fire({
            title: "¡ERROR!",
            text: errorMsg,
            icon: "error",
            confirmButtonText: "Volver a intentar",
            customClass: {
              container: "swal2-container",
              popup: "swal-popup-error",
              confirmButton: "swal-confirm-button",
              title: "swal-title",
            },
          });
      
        } finally {
          setIsLoading(false);
        }
      };
    
    

    return (
        <>
            <Box sx={{height:"90vh"}}>
                {/* <NavBar2 textPagina='Inicio > Cambiar contraseña' /> */}
                <Grid container display={'flex'} justifyContent={'center'}>
                    <Box width={'100%'}>
                        <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                            <Typography variant="h2" fontWeight={500} sx={{ color: '#3C98CB', mb: 4 }} paddingTop={5}>
                                Cambiar contraseña
                            </Typography>
                            <Tooltip title={'Modifica tu contraseña'} placement="top" arrow>
                                <IconButton sx={{ ml: 1 }}>
                                    <HelpOutlineIcon fontSize="small" color="action" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Box>
                </Grid>
                <Box  sx={{ paddingTop: 5 }} display={'flex'} justifyContent={'center'}>
                    <Grid container spacing={1} width={'90%'}>
                        <Grid item xs={12} md={4}>
                            <InputText
                                tooltip='Ingresa tu contraseña actual'
                                label='Contraseña actual'
                                placeholder='*********'
                                type={showPassword.currentPassword ? 'text' : 'password'}
                                value={passwords.oldPassword}
                                onChange={(e) => handleChange('oldPassword', e.target.value)}
                                error={Boolean(errors.oldPassword)}
                                helperText={errors.oldPassword}
                                icon={
                                    <IconButton onClick={() => togglePasswordVisibility('currentPassword')}>
                                        {showPassword.currentPassword ? (
                                            <VisibilityOffOutlinedIcon fontSize="small" sx={{color:"#3C98CB"}} />
                                        ) : (
                                            <RemoveRedEyeOutlinedIcon fontSize="small" sx={{color:"#3C98CB"}} />
                                        )}
                                    </IconButton>
                                }
                                className='bg-white'
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputText
                                tooltip='Mínimo 8 caracteres, debe contener por lo menos un número, mayúscula y algún carácter especial.'
                                label='Nueva contraseña'
                                placeholder='*********'
                                type={showPassword.newPassword ? 'text' : 'password'}
                                value={passwords.newPassword}
                                onChange={(e) => handleChange('newPassword', e.target.value)}
                                error={Boolean(errors.newPassword)}
                                helperText={errors.newPassword}
                                icon={
                                    <IconButton onClick={() => togglePasswordVisibility('newPassword')}>
                                        {showPassword.newPassword ? (
                                            <VisibilityOffOutlinedIcon fontSize="small" sx={{color:"#3C98CB"}} />
                                        ) : (
                                            <RemoveRedEyeOutlinedIcon fontSize="small" sx={{color:"#3C98CB"}} />
                                        )}
                                    </IconButton>
                                }
                                className='bg-white'
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputText
                                tooltip='Confirmar nueva contraseña'
                                label='Confirmar nueva contraseña'
                                placeholder='*********'
                                type={showPassword.confirmPassword ? 'text' : 'password'}
                                value={passwords.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                error={Boolean(errors.confirmPassword)}
                                helperText={errors.confirmPassword}
                                icon={
                                    <IconButton onClick={() => togglePasswordVisibility('confirmPassword')}>
                                        {showPassword.confirmPassword ? (
                                            <VisibilityOffOutlinedIcon fontSize="small" sx={{color:"#3C98CB"}} />
                                        ) : (
                                            <RemoveRedEyeOutlinedIcon fontSize="small" sx={{color:"#3C98CB"}} />
                                        )}
                                    </IconButton>
                                }
                                className='bg-white'
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box display={'flex'} alignItems={'center'} sx={{flexDirection: 'column', mt: {xs:5, md:15}, mb: {xs:0.5, md:5}   }}>
                    <Grid container spacing={2} justifyContent={'center'}>
                        <Grid item xs={12} sm={4} md={3} lg={2} sx={{mx: {xs:2}}}>
                            <Link href="/admin/home" passHref>
                                <Button fullWidth className="p-2 rounded-lg" sx={{ border: "1px solid #3C98CB" }}>
                                    Cancelar
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3} lg={2} sx={{mx: {xs:2}}}>
                            <Button
                                fullWidth
                                disabled={!isComplete}
                                sx={{
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    color: 'white',
                                    backgroundColor: isComplete ? '#3C98CB' : 'grey',
                                    '&:hover': {
                                        backgroundColor: isComplete ? '#357AA6' : 'grey',
                                    },
                                }}
                                onClick={handleSubmit}
                            >
                                {isLoading ? (
                                    <ReactLoading type="bars" color="white" height={20} width={20} />
                                ) : (
                                    'Cambiar contraseña'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
                {isToastError && (
                    <ToastErrorMsg description={isToastErrorMessage}/>
                )} 
                {isToastSuccess && (
                            <ToastSuccessMsg description={isToastSuccessMsg}/>
                )}
        </>
        
    );
};

export default Page;
