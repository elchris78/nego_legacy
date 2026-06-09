'use client';
import Link from 'next/link';
import { NavBar2 } from '@/menus/Nav';
import { Box, Grid, Typography, Button, Tooltip, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Datos from './components/Datos';
import Loading from '@/components/ui/Modals/loading';
import { getInfo } from './service/getInfo';
import { AvatarModal } from '@/Modals/ModalAvatar';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import userimg from '@/Asset/userNego.png'
import Image from 'next/image';
import { avatarsArray } from './service/Avatar';
import { updateUserProfile } from './service/actions';
import { TypeUser } from './service/typeUser';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Swal from 'sweetalert2';
import success from '@/Asset/successN.png';
import errorn from '@/Asset/error.png';

dayjs.extend(customParseFormat);

dayjs.locale('es'); 

const datosperfil = () => {

  const [formData, setFormData] = React.useState({
    avatar: '',
    userName: '',
    fechaNacimiento: '',
    gender: '',
    telefono: '',
  });

  const [error, setError] = React.useState<{ [key: string]: string }>({});
  const [userData, setUserData] = React.useState<TypeUser>({
    profilePicture: '', 
    fullName: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
  });
  const [isloading, setIsLoading] = React.useState(false);
  const [isModalAvatar, setIsModalAvatar] = React.useState(false);
  const [isToastError, setIsToastError] = React.useState(false);
  const [isToastSuccess, setIsToastSuccess] = React.useState(false);
  const [isRow3MenuOpen, setIsRow3MenuOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("este es el nombre; " + name)
  
    if (name === 'telefono') {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10); // Solo números, máximo 10 dígitos
      setFormData((prevState) => ({
          ...prevState,
          [name]: sanitizedValue, // Permitir valor vacío
      }));

      setError((prevError) => ({
          ...prevError,
          telefono: sanitizedValue && sanitizedValue.length < 10 ? 'El número debe tener 10 dígitos.' : '',
      }));
    }else if (name === 'userName') {
      const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
      setFormData((prevState) => ({
          ...prevState,
          [name]: formattedValue,
      }));
  
      setError((prevError) => ({
          ...prevError,
          userName: formattedValue.length < 3
              ? 'El nombre de usuario debe tener al menos 3 caracteres.'
              : formattedValue.length > 150
              ? 'El nombre de usuario no debe exceder los 150 caracteres.'
              : '',
      }));

      console.log("nom ", userData.fullName)
    } 
    // En handleChange para 'fechaNacimiento':
    else if (name === 'fechaNacimiento') {
      console.log("Fecha recibida:", value);
    
      if (!value) {
          setFormData((prevState) => ({
              ...prevState,
              [name]: '', 
          }));
          setError((prevError) => ({
              ...prevError,
              [name]: '', 
          }));
          return;
      }
  
      const date = dayjs(value, ['YYYY-MM-DD', 'DD/MM/YYYY'], true); 
      if (!date.isValid()) {
          console.error("Fecha inválida:", value);
          setError((prevError) => ({
              ...prevError,
              [name]: 'Fecha inválida', 
          }));
          return;
      }
    
      setFormData((prevState) => ({
          ...prevState,
          [name]: date.format('YYYY-MM-DD'),
      }));
      setError((prevError) => ({
          ...prevError,
          [name]: '', // Limpia errores si la fecha es válida
      }));
    
      console.log("Fecha formateada:", date.format('YYYY-MM-DD'));
      console.log("Fecha user:", userData.dateOfBirth);
}

     else if (name === 'gender') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value || '',  
      }));
    }
    
    else {
      setFormData((prevState) => ({
          ...prevState,
          [name]: value || '', // Manejo de valor vacío
      }));

      setError((prevError) => ({
          ...prevError,
          [name]: '',
      }));
  }
  };
  
  useEffect(() => {
    if (userData) {
        setFormData((prevState) => ({
            ...prevState,
            userName: prevState.userName || userData.fullName || '',
            telefono: prevState.telefono || userData.phoneNumber || '',
            fechaNacimiento: prevState.fechaNacimiento || userData.dateOfBirth || '',
        }));
    }
}, [userData]);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await getInfo(); 

    if (result.success) {
      setUserData(result.data);
      setIsLoading(false);
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAvatar = () => {
    setIsModalAvatar(true);
  }

  const closeModalAvatar = () => {
    setIsModalAvatar(false);
  }

  const getAvatarSrc = (name: string) => {
    const avatar = avatarsArray.find((a) => a.name === name);
    return avatar ? avatar.src : userimg;
  };

  const handleAvatarChange = (selectedAvatar: string) => {
    setFormData((prevState) => ({
      ...prevState,
      avatar: selectedAvatar,
    }));
    closeModalAvatar(); 
  };

  useEffect(() => {
    console.log('Avatar URL:', formData.avatar);
  }, [formData.avatar]);

  const handleSave = async () => {
    const newError: { [key: string]: string } = {};

    // Validación de `userName`
    if (formData.userName.trim() === '') {
        newError.userName = 'El nombre de usuario es necesario.';
        console.error('Nombre no válido');
    }

    if (formData.userName) {
        if (formData.userName.length < 3) {
            newError.userName = 'El nombre de usuario debe tener al menos 3 caracteres.';
            console.error('Nombre demasiado corto');
        }
        if (formData.userName.length > 150) {
            newError.userName = 'El nombre de usuario no debe exceder los 150 caracteres.';
            console.error('Nombre demasiado largo');
        }
    }

    // Validación de `telefono`

    if (formData.telefono && formData.telefono.length !== 10) {
      newError.telefono = 'El número debe tener 10 dígitos.';
      console.error('Telefono no válido');
    }

    // Si hay errores, no continuar
    if (Object.keys(newError).length > 0) {
        setError(newError);
        return;
    }

    setError({});

    const updatedData = {
        fullName: formData.userName || userData.fullName,
        gender: formData.gender || userData.gender,
        dateOfBirth: formData.fechaNacimiento || userData.dateOfBirth,
        phoneNumber: formData.telefono || userData.phoneNumber,
        profilePicture: formData.avatar || userData.profilePicture,
    };

    console.log('Datos enviados al servidor:', updatedData);
    setIsLoading(true);

    try {
        const updateResult = await updateUserProfile(updatedData);

        if (updateResult.success) {
            setIsToastSuccess(true);
            Swal.fire({
              title: '¡Éxito!',
              text: updateResult.message || 'Éxito', 
              imageUrl: success.src,
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: "Custom image",
              confirmButtonText: 'Cerrar',
              customClass: {
                container:'swal2-container',
                popup: 'swal-popup-succes', 
                confirmButton: 'swal-confirm-button', 
                title: 'swal-title', 
              }
            });
            setTimeout(() => {
                setIsToastSuccess(false);
            }, 5000);

            setUserData(updatedData);
            fetchData();
        } else {
            setIsToastError(true);
            Swal.fire({
              title: '¡Error!',
              text: updateResult.message || 'Error', 
              imageUrl: errorn.src,
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: "Custom image",
              confirmButtonText: 'Volver a intentar',
              customClass: {
                container:'swal2-container',
                popup: 'swal-popup-error', 
                confirmButton: 'swal-confirm-button', 
                title: 'swal-title', 
              },
            });
            setTimeout(() => {
                setIsToastError(false);
            }, 5000);
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        setIsToastError(true);
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un error al procesar la solicitud', 
          imageUrl: errorn.src,
          imageWidth: 100,
          imageHeight: 100,
          imageAlt: "Custom image",
          confirmButtonText: 'Volver a intentar',
          customClass: {
            container:'swal2-container',
            popup: 'swal-popup-error', 
            confirmButton: 'swal-confirm-button', 
            title: 'swal-title', 
          },
        });
        setTimeout(() => {
            setIsToastError(false);
        }, 5000);
    } finally {
        setIsLoading(false);
        console.log('Operación de guardado finalizada');
    }
};

  return (
    <>
      <Box>
        {isloading && <Loading />}
          {/* <NavBar2 textPagina='Inicio > Datos de perfil' />  */}

          <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'} padding={0}>
            <Box width={'100%'} padding={3} display={'flex'} justifyContent={'center'}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} sx={{ mb: 0 }}> 
                <Typography variant="h2" align="center" fontWeight={500} sx={{ color: '#5B6670', mb: 0 }}>
                  Datos de perfil
                </Typography>
              </Grid>
            </Box>

            <Box display="flex" alignItems="center" borderRadius={4} padding={2} onClick={handleOpenAvatar} sx={{cursor: 'pointer'}}>
              <Tooltip title="Puedes escoger tu avatar">
                <Image
                  src={
                    formData.avatar
                      ? getAvatarSrc(formData.avatar) // Prioriza el avatar seleccionado
                      : getAvatarSrc(userData.profilePicture) || userimg // Usa el avatar del usuario o una predeterminada
                  }
                  alt="user"
                  width={150}
                  height={150}
                />
              </Tooltip>
            </Box>

          </Grid>

          <Box display={'flex'} justifyItems={'center'} flexDirection={'row'} sx={{ mx: {xs: 4, sm: 20} }}>
            <Datos datosUsuario={userData} handleChange={handleChange} formData={formData} error={error} />
          </Box>

          <Box padding={2}>
            <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <Box width={'100%'} padding={3} display={'flex'} justifyContent={'center'}>
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} sm={1.5}>
                    <Link href="/admin/home" passHref>
                      <Button fullWidth className="p-2 rounded-lg" sx={{ border: "1px solid #3C98CB" }}>
                        Cancelar
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={1.5}>
                    <Button fullWidth sx={{background:"#3C98CB", color:"white"}} className="p-2 rounded-lg " onClick={handleSave}>
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Box>
          {isModalAvatar && (
            <AvatarModal
              isOpen={isModalAvatar}
              onClose={closeModalAvatar}
              avatarsArray={avatarsArray}
              onSelectAvatar={handleAvatarChange}
            />
          )}
      </Box>
    </>
  );
};

export default datosperfil;
