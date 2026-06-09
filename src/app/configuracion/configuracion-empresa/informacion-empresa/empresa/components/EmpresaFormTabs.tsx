"use client";

import { useEffect, useState } from "react";

import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";

import { useEmpresaForm } from "./EmpresaFormContext";
import DatosFiscales from "./datos-fiscales/DatosFiscales";
import DatosGenerales from "./datos-generales/DatosGenerales";
import DocumentacionAdicional from "./documentacion-adicional/DocumentacionAdicional";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingY: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EmpresaFormTabs = () => {
  const isMediumScreen = useMediaQuery("(max-width: 900px)");
  const { activeTab, setActiveTab, datosEmpresaForm } = useEmpresaForm();

  const isDisabled = !datosEmpresaForm.getValues("tieneDatosFiscales");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /* 
      ! Este effect y el estado `mounted` se utilizan para evitar el renderizado del componente en el servidor (SSR)
      ! hasta que se monte en el cliente y evitar problemas de desincronización entre el servidor y el cliente.
    */
    setMounted(true);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!mounted) return null; // Evita el render hasta que esté montado en el cliente

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant={isMediumScreen ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="basic tabs example"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#4197CB",
            },
            "& .MuiTab-root": {
              fontWeight: "500",
              color: "#9D9D9C",
              textTransform: "none",
              fontSize: "14px",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#4197CB",
            },
            "& .MuiTab-root.Mui-disabled": {
              color: "#D3D3D3", // gris claro
              // backgroundColor: "#F5F5F5", // opcional: fondo gris claro
            },
          }}
        >
          <Tab label="Datos generales" {...a11yProps(0)} />
          <Tab label="Datos fiscales" disabled={isDisabled} {...a11yProps(1)} />
          <Tab label="Documentación adicional" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={activeTab} index={0}>
        <DatosGenerales />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1}>
        <DatosFiscales />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={2}>
        <DocumentacionAdicional />
      </CustomTabPanel>
    </Box>
  );
};

export default EmpresaFormTabs;
