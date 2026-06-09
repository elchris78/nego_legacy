"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { useForm, UseFormReturn } from "react-hook-form";
import Cookies from "js-cookie";

import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { Option } from "@/components/ui/multiselect";
import { getCountries } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import {
  DatosComercialesEmpresaForm,
  datosFiscalesEmpresaForm,
  DatosGeneralesEmpresaForm,
} from "../services/companyFormTypes";
import { getMonedas, getRegimenesFiscales } from "../services/empresaActions";
import { AppDispatch } from "@/lib/store/store";
import { useDispatch } from "react-redux";
import { empresaActions } from "../services/empresaSlice";
import showAlert from "@/lib/utils/alerts";
import { Company } from "../services/companyTypes";

interface EmpresaFormContext {
  countriesOptions: Option[];
  regimenesFiscalesOptions: Option[];
  monedasOptions: Option[];
  datosEmpresaForm: UseFormReturn<DatosGeneralesEmpresaForm>;
  datosComercialesForm: UseFormReturn<DatosComercialesEmpresaForm>;
  datosFiscalesForm: UseFormReturn<datosFiscalesEmpresaForm>;
  handleSubmitForms: () => Promise<any>;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  getCompanyInfo: () => Promise<void>;
  setIsDatosFiscalesMounted: Dispatch<SetStateAction<boolean>>;
}

// Create the context
const EmpresaFormContext = createContext<EmpresaFormContext | undefined>(
  undefined
);

// Provider component
export const EmpresaFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token");
  const companyId = Cookies.get("companyId");

  const [countriesOptions, setCountriesOptions] = useState<Option[]>([]);
  const [monedasOptions, setMonedasOptions] = useState<Option[]>([]);
  const [regimenesFiscalesOptions, setRegimenesFiscalesOptions] = useState<
    Option[]
  >([]);

  const [activeTab, setActiveTab] = useState(0); // Tab activo en el formulario

  const [isDatosFiscalesMounted, setIsDatosFiscalesMounted] = useState(false);

  // Forms
  const datosEmpresaForm = useForm<DatosGeneralesEmpresaForm>({
    mode: "onTouched",
  });

  const datosComercialesForm = useForm<DatosComercialesEmpresaForm>({
    mode: "onTouched",
  });

  const datosFiscalesForm = useForm<datosFiscalesEmpresaForm>({
    mode: "onTouched",
  });

  useEffect(() => {
    if (!token || !companyId) return;
    getCompanyInfo();
  }, [token, companyId]);

  const getCompanyInfo = async () => {
    try {
      const { company } = await dispatch(
        empresaActions.getCompanyInfo({
          token,
          companyId,
        })
      ).unwrap();
      await asignValuesToForms(company); // Asign values to forms
    } catch (error) {
      console.error("Error fetching company info:", error);
      showAlert({
        success: false,
        message: "Error al obtener los datos de la empresa",
      });
    }
  };

  // Asign values to forms
  const asignValuesToForms = async (company: Company) => {
    // Datos empresa
    datosEmpresaForm.setValue(
      "codigoPostal",
      company.datosEmpresa.codigoPostal,
      { shouldValidate: true }
    );
    datosEmpresaForm.setValue("pais", company.datosEmpresa.pais, {
      shouldValidate: true,
    });
    datosEmpresaForm.setValue("estado", company.datosEmpresa.estado, {
      shouldValidate: true,
    });
    datosEmpresaForm.setValue("municipio", company.datosEmpresa.municipio, {
      shouldValidate: true,
    });
    datosEmpresaForm.setValue("localidad", company.datosEmpresa.localidad, {
      shouldValidate: true,
    });
    datosEmpresaForm.setValue("colonia", company.datosEmpresa.colonia, {
      shouldValidate: true,
    });
    datosEmpresaForm.setValue("calle", company.datosEmpresa.calle, {
      shouldValidate: true,
    });
    datosEmpresaForm.setValue(
      "numeroExterior",
      company.datosEmpresa.numeroExterior,
      { shouldValidate: true }
    );
    datosEmpresaForm.setValue(
      "numeroInterior",
      company.datosEmpresa.numeroInterior,
      { shouldValidate: true }
    );
    datosEmpresaForm.setValue("curp", company.datosEmpresa.curp, {
      shouldValidate: true,
    });
    datosEmpresaForm.setValue(
      "registroPatronalIMSS",
      company.datosEmpresa.registroPatronalIMSS,
      { shouldValidate: true }
    );
    datosEmpresaForm.setValue(
      "tieneDatosFiscales",
      company.datosEmpresa.tieneDatosFiscales,
      { shouldValidate: true }
    );

    // Datos comerciales
    datosComercialesForm.setValue("logoGeneral", null, {
      shouldValidate: true,
    });
    datosComercialesForm.setValue(
      "nombreComercial",
      company.datosComerciales.nombreComercial,
      { shouldValidate: true }
    );
    datosComercialesForm.setValue(
      "telefonoFijo",
      company.datosComerciales.telefonoFijo,
      { shouldValidate: true }
    );
    datosComercialesForm.setValue(
      "telefonoCelular",
      company.datosComerciales.telefonoCelular,
      { shouldValidate: true }
    );
    datosComercialesForm.setValue(
      "correoContacto",
      company.datosComerciales.correoContacto,
      { shouldValidate: true }
    );
    datosComercialesForm.setValue(
      "paginaWeb",
      company.datosComerciales.paginaWeb,
      { shouldValidate: true }
    );

    // Datos fiscales
    datosFiscalesForm.setValue("pais", company.datosFiscales.pais, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue(
      "codigoPostal",
      company.datosFiscales.codigoPostal,
      { shouldValidate: true }
    );
    datosFiscalesForm.setValue("estado", company.datosFiscales.estado, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue("municipio", company.datosFiscales.municipio, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue("localidad", company.datosFiscales.localidad, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue("colonia", company.datosFiscales.colonia, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue("calle", company.datosFiscales.calle, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue(
      "numeroExterior",
      company.datosFiscales.numeroExterior,
      { shouldValidate: true }
    );
    datosFiscalesForm.setValue(
      "numeroInterior",
      company.datosFiscales.numeroInterior,
      { shouldValidate: true }
    );
    datosFiscalesForm.setValue("rfc", company.datosFiscales.rfc, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue(
      "regimenFiscal",
      company.datosFiscales.regimenFiscal,
      { shouldValidate: true }
    );
    datosFiscalesForm.setValue("archivoLlavePrivada", null, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue("archivoSelloDigital", null, {
      shouldValidate: true,
    });
    datosFiscalesForm.setValue(
      "contrasenaSello",
      company.datosFiscales.contrasenaSello,
      { shouldValidate: true }
    );
    datosFiscalesForm.setValue(
      "fechaVigenciaSello",
      company.datosFiscales.fechaVigenciaSello
        ? new Date(company.datosFiscales.fechaVigenciaSello)
            .toISOString()
            .split("T")[0]
        : "",
      { shouldValidate: true }
    );

    // Trigger validations
    await datosEmpresaForm.trigger();
    await datosComercialesForm.trigger();
    await datosFiscalesForm.trigger();
  };

  // Fetch countries
  useEffect(() => {
    if (!token) return;
    const fetchCountries = async () => {
      try {
        const resp = await getCountries({ token });
        const countries = resp.map((country) => ({
          value: country.c_Pais,
          label: country.descripcion,
        }));
        setCountriesOptions(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [token]);

  // Fetch monedas
  useEffect(() => {
    if (!token) return;
    const fetchMonedas = async () => {
      try {
        const resp = await getMonedas({ token });
        const monedas = resp.map((moneda) => ({
          value: moneda.claveNego.toString(),
          label: `${moneda.c_Moneda} - ${moneda.descripcion}`,
        }));
        setMonedasOptions(monedas);
      } catch (error) {
        console.error("Error fetching monedas:", error);
      }
    };

    fetchMonedas();
  }, [token]);

  // Fetch regimenes fiscales
  useEffect(() => {
    if (!token) return;
    const fetchRegimenesFiscales = async () => {
      try {
        const resp = await getRegimenesFiscales({ token });
        const regimenes = resp.map((regimen) => ({
          value: regimen.claveNego.toString(),
          label: regimen.descripcion,
        }));
        setRegimenesFiscalesOptions(regimenes);
      } catch (error) {
        console.error("Error fetching regimenes fiscales:", error);
      }
    };

    fetchRegimenesFiscales();
  }, [token]);

  const handleSubmitForms = async () => {
    const isValid = await Promise.all([
      datosEmpresaForm.trigger(),
      datosComercialesForm.trigger(),
      datosFiscalesForm.trigger(),
    ]);
    console.log("🚀 ~ handleSubmitForms ~ isValid:", isValid);

    if (isValid.every((valid) => valid)) {
      const values = {
        datosEmpresa: datosEmpresaForm.getValues(),
        datosComerciales: datosComercialesForm.getValues(),
        datosFiscales: datosFiscalesForm.getValues(),
      };

      return {
        isValid: true,
        values,
      };
    } else {
      const errors = {
        datosEmpresa: datosEmpresaForm.formState.errors,
        datosComerciales: datosComercialesForm.formState.errors,
        datosFiscales: datosFiscalesForm.formState.errors,
      };
      return {
        isValid: false,
        errors,
      };
    }
  };

  const isDatosFiscalesFilled = () => {
    const values = datosFiscalesForm.getValues();
    // Excluye campos que no quieras validar, si aplica
    return Object.values(values).some(
      (v) => v !== undefined && v !== null && v !== ""
    );
  };

  /* 
    - Verificar si los formularios de Datos Empresa y Datos Comerciales son correctos
    - Después se validada si el valor de tieneDatosFiscales es verdadero, si es así,
      se valida si el formulario de Datos Fiscales está montado (isDatosFiscalesMounted).
    - Si está montado, se verifica que el formulario sea correcto y que al menos un campo esté lleno.
    - Si no está montado, solo se verifica que al menos un campo esté lleno. 
   */
  const isFormComplete =
    datosEmpresaForm.formState.isValid &&
    datosComercialesForm.formState.isValid &&
    (datosEmpresaForm.watch("tieneDatosFiscales")
      ? isDatosFiscalesMounted
        ? datosFiscalesForm.formState.isValid && isDatosFiscalesFilled()
        : isDatosFiscalesFilled()
      : true);

  return (
    <EmpresaFormContext.Provider
      value={{
        countriesOptions,
        regimenesFiscalesOptions,
        monedasOptions,
        datosEmpresaForm,
        datosComercialesForm,
        datosFiscalesForm,
        handleSubmitForms,
        isFormComplete,
        keyConfig: null,
        activeTab,
        setActiveTab,
        getCompanyInfo,
        setIsDatosFiscalesMounted,
      }}
    >
      {children}
    </EmpresaFormContext.Provider>
  );
};

// Custom hook to use the EmpresaFormContext
export const useEmpresaForm = () => {
  const context = useContext(EmpresaFormContext);
  if (!context) {
    throw new Error(
      "useEmpresaForm must be used within an EmpresaFormProvider"
    );
  }
  return context;
};
