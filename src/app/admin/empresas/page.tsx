"use client"
import { NavBar2 } from '@/menus/Nav'
import { Welcome } from '@/admin/empresas/components/WelcomeEmpresas'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies } from './services/companySlices';
import { RootState, AppDispatch } from '@/store';
import Cookies from 'js-cookie';
import Loading from '@/components/ui/Modals/loading';


  const titulo = 'Empresas' 
  const subtitulo= 'De momento, no tienes ninguna empresa creada.\nDa click en ';
  const texto = 'Crear nueva empresa'


const index = () => {

  const dispatch: AppDispatch = useDispatch();
  const { companies, loading, error } = useSelector((state: RootState) => state.company);
  const token = Cookies.get('auth-token');

  useEffect(() => {
    if (token) {
      dispatch(getCompanies(token)); 
    }
  }, [dispatch, token]);

  const handleUpdate = () => {
    if (token) {
      dispatch(getCompanies(token));
    }
  }
  
  if (loading) return <div><Loading/></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
        {/* <NavBar2 textPagina='Inicio > Empresas'/> */}
        
        <Welcome 
          title = {titulo}
          subtitle={subtitulo}
          subtitle2={texto}
          textButton={texto}
          showTooltip={false}
          companiesArray={companies}
          handleUpdate={handleUpdate}
        />
  
    </div>
  )
}

export default index
