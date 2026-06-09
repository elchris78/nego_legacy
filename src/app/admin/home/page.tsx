"use client";
import { NavBar2 } from '@/menus/Nav';
import { Welcome } from './components/welcome';
import { Tooltip } from '@radix-ui/react-tooltip';
import React, { useEffect, useState } from 'react';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { fetchAllCompanies, createCompany } from '../empresas/services/companyActions';
import {SelectedCompany} from './components/SelectedCompany';
import Loading from '@/Modals/loading';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function SomePage() {

 

  const titulo = 'Bienvenido a NEGO Web';
  const subtitulo = 'De momento, no tienes ninguna empresa agregada \n Da click en Crear nueva empresa.';
  const texto = 'Crear nueva empresa';
  const tooltip = 'Crea tu primera empresa';

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get('auth-token');
  const router = useRouter();

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        router.push('/not-authorized');
        return;
      }

      const data = await fetchAllCompanies({ token });
      setCompanies(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err.message);
      } else {
        setError('Error desconocido');
        console.error('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshCompanies = async () => {
    await fetchCompanies();
  };

  useEffect(() => {
    if (token) {
      fetchCompanies();
    } else {
      router.push('/not-authorized');
      return;
    }
  }, [token]);

  if (loading) {
    return <>  </>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {/* <NavBar2  textPagina='Inicio'/> */}
      {companies.length > 0 ? ( 
        <SelectedCompany companiesArray={companies}/>
      ) : (
        <Welcome
          title={titulo}
          subtitle={subtitulo}
          textButton={texto}
          showTooltip={false}
          tooltip={tooltip}
          refreshCompanies={refreshCompanies} // Pasa la función de actualización a Welcome
        />
      )}
    </>
  );
}
