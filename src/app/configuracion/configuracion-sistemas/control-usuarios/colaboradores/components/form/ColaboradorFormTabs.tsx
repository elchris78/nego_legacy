"use client";

import { useEffect, useState } from "react";

import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { useSearchParams } from "next/navigation";

import { useColaboradorFormContext } from "./ColaboradorFormContext";
import Avales from "./avales/Avales";
import DatosGenerales from "./datos-generales/DatosGenerales";
import DocumentacionAdicional from "./documentacion-adicional/DocumentacionAdicional";
import DocumentacionAvales from "./documentacion-avales/DocumentacionAvales";
import InformacionLaboral from "./informacion-laboral/InformacionLaboral";
import OtrosDatos from "./otros-datos/OtrosDatos";

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

const ColaboradorFormTabs = () => {
  const isMediumScreen = useMediaQuery("(max-width: 900px)");
  const { activeTab, setActiveTab } = useColaboradorFormContext();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [mounted, setMounted] = useState(false);

  const showDocAdicional = mode === "edit" || mode === "view";
  const maxTabIndex = showDocAdicional ? 5 : 4;

  useEffect(() => {
    /* 
      ! Este effect y el estado `mounted` se utilizan para evitar el renderizado del componente en el servidor (SSR)
      ! hasta que se monte en el cliente y evitar problemas de desincronización entre el servidor y el cliente.
    */
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeTab > maxTabIndex) {
      setActiveTab(maxTabIndex);
    }
  }, [activeTab, maxTabIndex, setActiveTab]);

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
          }}
        >
          <Tab label="Datos generales" {...a11yProps(0)} />
          <Tab label="Información laboral" {...a11yProps(1)} />
          <Tab label="Otros datos" {...a11yProps(2)} />
          <Tab label="Avales" {...a11yProps(3)} />
          <Tab label="Documentación de avales" {...a11yProps(4)} />
          {showDocAdicional && (
            <Tab label="Documentación adicional" {...a11yProps(5)} />
          )}
        </Tabs>
      </Box>
      <CustomTabPanel value={activeTab} index={0}>
        <DatosGenerales />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1}>
        <InformacionLaboral />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={2}>
        <OtrosDatos />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={3}>
        <Avales />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={4}>
        <DocumentacionAvales />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={5}>
        <DocumentacionAdicional />
      </CustomTabPanel>
    </Box>
  );
};

export default ColaboradorFormTabs;
