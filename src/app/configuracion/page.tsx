"use client"
import React, { useEffect, useState } from 'react'
import {  Box } from '@mui/material';
import Image from 'next/image';
import dashboard from "@/assets/dashboardfalso.png";
import { AppDispatch, RootState } from '@/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { configuracionActions } from './services/sliceConfig';
import CompanyInfoRequiredModal from './components/CompanyInfoRequiredModal';
import Loading from "@/components/ui/Modals/loading";

const index = () => {

  const dispatch: AppDispatch = useDispatch();
  const { isConfigured, loading } = useSelector(
    (state: RootState) => state.configuracion
  );

  const token = Cookies.get("auth-token");
  const companyId = Cookies.get("companyId");

  useEffect(() => {
    if (token && companyId) {
      dispatch(
        configuracionActions.getCompanyIsConfigured({
          companyId: Number(companyId),
          token,
        }) as any
      );
    }
  }, [token, companyId, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    < >
      <CompanyInfoRequiredModal isOpen={isConfigured === false} />

      <Box width={"100%"} paddingBlock={10} paddingInline={10}>
        <Image src={dashboard} alt="Dashboard" style={{ width: "85%", height: "auto" }} />
      </Box>
    </>
      

  )
}

export default index
