"use client";

import { createContext, useContext, useEffect, useState, useMemo, SetStateAction, Dispatch } from "react";

import {
  useForm,
  UseFormReturn,
  useFieldArray,
  FieldArrayWithId,
} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import {
  DomicilioFiscalColaboradorForm,
  InformacionGeneralColaboradorForm,
  DomicilioParticularColaboradorForm,
  DatosLaboralesColaboradorForm,
  HistorialLaboralColaboradorForm,
  ContactoEmergenciaFormValues,
  AvalColaboradorFormValues,
  DocumentacionAvalesColaboradorFormValues,
} from "../../services/colaboradoresFormsTypes";
import { colaboradoresActions } from "../../services/colaboradoresSlice";
import { useDataForms } from "../../hooks/useDataForms";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Option } from "@/components/ui/multiselect";
import type { Colaborador } from "../../services/colaboradoresTypes";
import type { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import showAlert from "@/lib/utils/alerts";
import Loading from "@/components/ui/Modals/loading";

interface ColaboradorFormContext {
  informacionGeneralForm: UseFormReturn<InformacionGeneralColaboradorForm>;
  domicilioFiscalForm: UseFormReturn<DomicilioFiscalColaboradorForm>;
  domicilioParticularForm: UseFormReturn<DomicilioParticularColaboradorForm>;
  datosLaboralesForm: UseFormReturn<DatosLaboralesColaboradorForm>;
  historialLaboralForm: UseFormReturn<HistorialLaboralColaboradorForm>;
  contactoEmergenciaForm: UseFormReturn<ContactoEmergenciaFormValues>;
  avalColaboradorForm: UseFormReturn<AvalColaboradorFormValues>;
  documentacionAvalesForm: UseFormReturn<DocumentacionAvalesColaboradorFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentColaborador: Colaborador | null;
  isLoadingColaborador: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  usersOptions: Option[];
  countriesOptions: Option[];
  banksOptions: Option[];
  puestosOptions: Option[];
  departamentosOptions: Option[];
  colaboradoresOptions: Option[];
  // Contacto de emergencia functions and fields
  contactosEmergenciaFields: FieldArrayWithId<
    ContactoEmergenciaFormValues,
    "contactosEmergencia",
    "id"
  >[];
  handleAddEmergencyContact: () => void;
  handleRemoveEmergencyContact: (index: number) => void;

  // Avales functions and fields
  avalesFields: FieldArrayWithId<AvalColaboradorFormValues, "avales", "id">[];
  handleAddAval: () => void;
  handleRemoveAval: (index: number) => void;

  // Documentacion avales functions and fields
  documentacionAvalesFields: FieldArrayWithId<
    DocumentacionAvalesColaboradorFormValues,
    "documentacionAvales",
    "id"
  >[];
  handleAddDocumentacionAval: () => void;
  handleRemoveDocumentacionAval: (index: number) => void;
}

// Crear el contexto
const ColaboradorFormContext = createContext<
  ColaboradorFormContext | undefined
>(undefined);

// Proveedor del contexto
export const ColaboradorFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    usersOptions,
    setUsersOptions,
    countriesOptions,
    banksOptions,
    puestosOptions,
    departamentosOptions,
    colaboradoresOptions
  } = useDataForms();

  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Colaboradores");

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [activeTab, setActiveTab] = useState(0); // Tab activo en el formulario

  // Redux selector
  const currentColaborador = useSelector(
    (state: RootState) => state.colaboradores.currentColaborador
  );
  const isLoadingColaborador = useSelector(
    (state: RootState) => state.colaboradores.isLoadingColaborador
  );

  // Forms
  const informacionGeneralForm = useForm<InformacionGeneralColaboradorForm>({
    mode: "all",
  });
  const domicilioFiscalForm = useForm<DomicilioFiscalColaboradorForm>({
    mode: "all",
  });
  const domicilioParticularForm = useForm<DomicilioParticularColaboradorForm>({
    mode: "all",
  });
  const datosLaboralesForm = useForm<DatosLaboralesColaboradorForm>({
    mode: "all",
  });
  const historialLaboralForm = useForm<HistorialLaboralColaboradorForm>({
    mode: "all",
  });
  const contactoEmergenciaForm = useForm<ContactoEmergenciaFormValues>({
    mode: "all",
    defaultValues: {
      contactosEmergencia: [
        {
          nombreCompleto: "",
          telefono: "",
          nombreBeneficiario: "",
          ineBeneficiario: "",
          historialMedico: "",
          notasAdicionales: "",
        },
      ],
    },
  });
  const {
    fields: contactosEmergenciaFields,
    append: appendContactoEmergencia,
    remove: removeContactoEmergencia,
  } = useFieldArray({
    control: contactoEmergenciaForm.control,
    name: "contactosEmergencia",
  });
  const avalColaboradorForm = useForm<AvalColaboradorFormValues>({
    mode: "all",
    defaultValues: {
      avales: [
        {
          nombreCompleto: "",
          fechaNacimiento: "",
          pais: "",
          codigoPostal: "",
          estado: "",
          ciudad: "",
          colonia: "",
          calle: "",
          numeroExterior: "",
          numeroInterior: "",
          telefono: "",
        },
      ],
    },
  });
  const {
    fields: avalesFields,
    append: appendAval,
    remove: removeAval,
  } = useFieldArray({
    control: avalColaboradorForm.control,
    name: "avales",
  });
  const documentacionAvalesForm =
    useForm<DocumentacionAvalesColaboradorFormValues>({
      mode: "all",
      defaultValues: {
        documentacionAvales: [
          {
            rfc: "",
            constanciaSituacionFiscalFile: null,
            curp: "",
            ine: "",
            conyuge: "",
            referenciaFile: null,
          },
        ],
      },
    });
  const {
    fields: documentacionAvalesFields,
    append: appendDocumentacionAval,
    remove: removeDocumentacionAval,
  } = useFieldArray({
    control: documentacionAvalesForm.control,
    name: "documentacionAvales",
  });

  // Manejador para agregar un colaborador nuevo
  const handleAddEmergencyContact = () => {
    appendContactoEmergencia({
      nombreCompleto: "",
      telefono: "",
      nombreBeneficiario: "",
      ineBeneficiario: "",
      historialMedico: "",
      notasAdicionales: "",
    });
  };

  // Manejador para agregar un nuevo aval
  const handleAddAval = () => {
    appendAval({
      nombreCompleto: "",
      fechaNacimiento: "",
      pais: "",
      codigoPostal: "",
      estado: "",
      ciudad: "",
      colonia: "",
      calle: "",
      numeroExterior: "",
      numeroInterior: "",
      telefono: "",
    });
    handleAddDocumentacionAval(); // Agregar un nuevo campo de documentación aval al mismo tiempo
  };

  const handleAddDocumentacionAval = () => {
    appendDocumentacionAval({
      rfc: "",
      constanciaSituacionFiscalFile: null,
      curp: "",
      ine: "",
      conyuge: "",
      referenciaFile: null,
    });
  };

  const handleSubmitForms = async () => {
    // Validar los formularios
    const [
      infoValid,
      fiscalValid,
      particularValid,
      datosValid,
      historialValid,
      contactoValid,
      documentacionValid,
      avalesValid,
    ] = await Promise.all([
      informacionGeneralForm.trigger(),
      domicilioFiscalForm.trigger(),
      domicilioParticularForm.trigger(),
      datosLaboralesForm.trigger(),
      historialLaboralForm.trigger(),
      contactoEmergenciaForm.trigger(),
      documentacionAvalesForm.trigger(),
      avalColaboradorForm.trigger(),
    ]);

    const isValid =
      infoValid &&
      fiscalValid &&
      particularValid &&
      datosValid &&
      historialValid &&
      contactoValid &&
      documentacionValid &&
      avalesValid;

    if (!isValid) {
      const errors = {
        informacionGeneral: informacionGeneralForm.formState.errors,
        domicilioFiscal: domicilioFiscalForm.formState.errors,
        domicilioParticular: domicilioParticularForm.formState.errors,
        datosLaborales: datosLaboralesForm.formState.errors,
        historialLaboral: historialLaboralForm.formState.errors,
        contactoEmergencia: contactoEmergenciaForm.formState.errors,
        documentacionAvales: documentacionAvalesForm.formState.errors,
        avales: avalColaboradorForm.formState.errors,
      };
      return { isValid: false, errors };
    }

    const values = {
      informacionGeneral: informacionGeneralForm.getValues(),
      domicilioFiscal: domicilioFiscalForm.getValues(),
      domicilioParticular: domicilioParticularForm.getValues(),
      datosLaborales: datosLaboralesForm.getValues(),
      historialLaboral: historialLaboralForm.getValues(),
      contactosEmergencia:
        contactoEmergenciaForm.getValues().contactosEmergencia, // Enviar solo el array de contactos
      documentacionAvales:
        documentacionAvalesForm.getValues().documentacionAvales, // Enviar solo el array de documentación
      avales: avalColaboradorForm.getValues().avales, // Enviar solo el array de avales
    };
    return { isValid: true, values };
  };

  const getCurrentColaborador = async () => {
    try {
      const { colaborador } = await dispatch(
        colaboradoresActions.getColaboradorById({ token, id: id! })
      ).unwrap();
      asignValuesToForms(colaborador); // Asignar valores al formulario
    } catch (error) {
      console.error("Error fetching colaborador:", error);
      showAlert({
        success: false,
        message: "Error al obtener el colaborador",
      });
      router.push("/configuracion/configuracion-sistemas/control-usuarios/colaboradores");
    }
  };

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentColaborador();
    }
    if (mode === "new") {
      // Asign default values for new colaborador
      informacionGeneralForm.setValue("estatus", "true");
      informacionGeneralForm.setValue("tieneUsuarioSistema", "false");
    }
  }, [mode, id]);

  const asignValuesToForms = (colaborador: Colaborador) => {
    // Información general
    informacionGeneralForm.setValue("userProvidedId", colaborador.id);
    informacionGeneralForm.setValue("nombreCompleto", colaborador.nombreCompleto);
    informacionGeneralForm.setValue("usuarioSistemaId", colaborador.usuarioSistemaId);
    informacionGeneralForm.setValue("estatus", colaborador.estatus ? "true" : "false");
    informacionGeneralForm.setValue("tipoColaborador", colaborador.tipoColaborador);
    informacionGeneralForm.setValue("fechaNacimiento", colaborador.fechaNacimiento);
    informacionGeneralForm.setValue("telefono", colaborador.telefono);
    informacionGeneralForm.setValue("correoElectronico", colaborador.correoElectronico);
    informacionGeneralForm.setValue("curp", colaborador.curp);
    informacionGeneralForm.setValue("ine", colaborador.ine);
    informacionGeneralForm.setValue("numeroSeguroSocial", colaborador.numeroSeguroSocial);
    informacionGeneralForm.setValue("conyuge", colaborador.conyuge);
    informacionGeneralForm.setValue("referencias", colaborador.referencias);
    informacionGeneralForm.setValue("referenciaBancaria", colaborador.referenciaBancaria);
    informacionGeneralForm.setValue("tieneUsuarioSistema", colaborador.tieneUsuarioSistema ? "true" : "false");
    informacionGeneralForm.trigger(); // Para validar el formulario

    // Domicilio fiscal
    if (colaborador.domicilioFiscal) {
      domicilioFiscalForm.setValue("calle", colaborador.domicilioFiscal.calle);
      domicilioFiscalForm.setValue("numeroExterior", colaborador.domicilioFiscal.numeroExterior);
      domicilioFiscalForm.setValue("numeroInterior", colaborador.domicilioFiscal.numeroInterior);
      domicilioFiscalForm.setValue("colonia", colaborador.domicilioFiscal.colonia);
      domicilioFiscalForm.setValue("ciudad", colaborador.domicilioFiscal.ciudad);
      domicilioFiscalForm.setValue("estado", colaborador.domicilioFiscal.estado);
      domicilioFiscalForm.setValue("codigoPostal", colaborador.domicilioFiscal.codigoPostal);
      domicilioFiscalForm.setValue("pais", colaborador.domicilioFiscal.pais);
      domicilioFiscalForm.setValue("rfc", colaborador.domicilioFiscal.rfc ?? "");
      domicilioFiscalForm.setValue("correoBuzonTributario", colaborador.domicilioFiscal.correoBuzonTributario ?? "");
      domicilioFiscalForm.trigger(); // Para validar el formulario
    }

    // Domicilio particular
    if (colaborador.domicilioParticular) {
      domicilioParticularForm.setValue("calle", colaborador.domicilioParticular.calle);
      domicilioParticularForm.setValue("numeroExterior", colaborador.domicilioParticular.numeroExterior);
      domicilioParticularForm.setValue("numeroInterior", colaborador.domicilioParticular.numeroInterior);
      domicilioParticularForm.setValue("colonia", colaborador.domicilioParticular.colonia);
      domicilioParticularForm.setValue("ciudad", colaborador.domicilioParticular.ciudad);
      domicilioParticularForm.setValue("estado", colaborador.domicilioParticular.estado);
      domicilioParticularForm.setValue("codigoPostal", colaborador.domicilioParticular.codigoPostal);
      domicilioParticularForm.setValue("pais", colaborador.domicilioParticular.pais);
      domicilioParticularForm.trigger(); // Para validar el formulario
    }

    // Datos laborales
    if (colaborador.datosLaborales) {
      datosLaboralesForm.setValue("puesto", colaborador.datosLaborales.puesto);
      datosLaboralesForm.setValue("departamento", colaborador.datosLaborales.departamento);
      datosLaboralesForm.setValue("supervisorDirecto", colaborador.datosLaborales.supervisorDirecto);
      datosLaboralesForm.setValue("fechaContratacion", colaborador.datosLaborales.fechaContratacion);
      datosLaboralesForm.setValue("fechaIngreso", colaborador.datosLaborales.fechaIngreso);
      datosLaboralesForm.setValue("fechaFin", colaborador.datosLaborales.fechaFin);
      datosLaboralesForm.setValue("horarioTrabajo", colaborador.datosLaborales.horarioTrabajo);
      datosLaboralesForm.setValue("numeroCuentaBancaria", colaborador.datosLaborales.numeroCuentaBancaria);
      datosLaboralesForm.setValue("banco", colaborador.datosLaborales.banco);
      datosLaboralesForm.trigger(); // Para validar el formulario
    }

    // Historial laboral
    if (colaborador.historialLaboral) {
      historialLaboralForm.setValue("ultimoTrabajo", colaborador.historialLaboral.ultimoTrabajo);
      historialLaboralForm.setValue("periodoUltimoTrabajo", colaborador.historialLaboral.periodoUltimoTrabajo);
      historialLaboralForm.setValue("ultimoPuestoTrabajo", colaborador.historialLaboral.ultimoPuestoTrabajo);
      historialLaboralForm.setValue("observacionesUltimoTrabajo", colaborador.historialLaboral.observacionesUltimoTrabajo);
      historialLaboralForm.setValue("penultimoTrabajo", colaborador.historialLaboral.penultimoTrabajo);
      historialLaboralForm.setValue("periodoPenultimoTrabajo", colaborador.historialLaboral.periodoPenultimoTrabajo);
      historialLaboralForm.setValue("penultimoPuestoTrabajo", colaborador.historialLaboral.penultimoPuestoTrabajo);
      historialLaboralForm.setValue("observacionesPenultimoTrabajo", colaborador.historialLaboral.observacionesPenultimoTrabajo);
      historialLaboralForm.trigger(); // Para validar el formulario
    }

    // Contactos de emergencia
    if (colaborador.contactosEmergencia && colaborador.contactosEmergencia.length > 0) {
      colaborador.contactosEmergencia.forEach((contacto, index) => {
        contactoEmergenciaForm.setValue(`contactosEmergencia.${index}.nombreCompleto`, contacto.nombreCompleto);
        contactoEmergenciaForm.setValue(`contactosEmergencia.${index}.telefono`, contacto.telefono);
        contactoEmergenciaForm.setValue(`contactosEmergencia.${index}.nombreBeneficiario`, contacto.nombreBeneficiario);
        contactoEmergenciaForm.setValue(`contactosEmergencia.${index}.ineBeneficiario`, contacto.ineBeneficiario);
        contactoEmergenciaForm.setValue(`contactosEmergencia.${index}.historialMedico`, contacto.historialMedico);
        contactoEmergenciaForm.setValue(`contactosEmergencia.${index}.notasAdicionales`, contacto.notasAdicionales);
      });
      contactoEmergenciaForm.trigger(); // Para validar el formulario
    }

    // Avales
    if (colaborador.avales && colaborador.avales.length > 0) {
      colaborador.avales.forEach((aval, index) => {
        avalColaboradorForm.setValue(`avales.${index}.id`, aval.id);
        avalColaboradorForm.setValue(`avales.${index}.nombreCompleto`, aval.nombreCompleto);
        avalColaboradorForm.setValue(`avales.${index}.fechaNacimiento`, aval.fechaNacimiento);
        avalColaboradorForm.setValue(`avales.${index}.pais`, aval.pais);
        avalColaboradorForm.setValue(`avales.${index}.codigoPostal`, aval.codigoPostal);
        avalColaboradorForm.setValue(`avales.${index}.estado`, aval.estado);
        avalColaboradorForm.setValue(`avales.${index}.ciudad`, aval.ciudad);
        avalColaboradorForm.setValue(`avales.${index}.colonia`, aval.colonia);
        avalColaboradorForm.setValue(`avales.${index}.calle`, aval.calle);
        avalColaboradorForm.setValue(`avales.${index}.numeroExterior`, aval.numeroExterior);
        avalColaboradorForm.setValue(`avales.${index}.numeroInterior`, aval.numeroInterior);
        avalColaboradorForm.setValue(`avales.${index}.telefono`, aval.telefono);
      });
      avalColaboradorForm.trigger(); // Para validar el formulario

      // Documentación de avales
      if (colaborador.documentacionAvales && colaborador.documentacionAvales.length > 0) {
        colaborador.documentacionAvales.forEach((documento, index) => {
          documentacionAvalesForm.setValue(`documentacionAvales.${index}.id`, documento.id);
          documentacionAvalesForm.setValue(`documentacionAvales.${index}.rfc`, documento.rfc);
          documentacionAvalesForm.setValue(`documentacionAvales.${index}.curp`, documento.curp);
          documentacionAvalesForm.setValue(`documentacionAvales.${index}.ine`, documento.ine);
          documentacionAvalesForm.setValue(`documentacionAvales.${index}.conyuge`, documento.conyuge);
        });
        documentacionAvalesForm.trigger(); // Para validar el formulario
      }
    }
  };

  useEffect(() => {
    // Asignar usuario seleccionado a las opciones de usuario
    if (!currentColaborador) return;
    if (
      !currentColaborador.tieneUsuarioSistema ||
      !currentColaborador.usuarioSistemaId ||
      !currentColaborador.usuarioSistemaNombre
    )
      return;
    setUsersOptions((prev) => {
      // Verifica si ya existe el usuario en las opciones
      const exists = prev.some(
        (opt) => opt.value === (currentColaborador?.usuarioSistemaId ?? "")
      );
      if (exists) return prev;
      return [
        {
          value: currentColaborador?.usuarioSistemaId ?? "",
          label: currentColaborador?.usuarioSistemaNombre ?? "",
        },
        ...prev,
      ];
    });
  }, [currentColaborador, setUsersOptions]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <ColaboradorFormContext.Provider
      value={{
        informacionGeneralForm,
        domicilioFiscalForm,
        domicilioParticularForm,
        datosLaboralesForm,
        contactoEmergenciaForm,
        avalColaboradorForm,
        historialLaboralForm,
        documentacionAvalesForm,
        handleSubmitForms,
        currentColaborador,
        isLoadingColaborador,
        keyConfig,
        activeTab,
        setActiveTab,
        contactosEmergenciaFields,
        handleAddEmergencyContact,
        handleRemoveEmergencyContact: removeContactoEmergencia,
        avalesFields,
        handleAddAval,
        handleRemoveAval: removeAval,
        documentacionAvalesFields,
        handleAddDocumentacionAval,
        handleRemoveDocumentacionAval: removeDocumentacionAval,
        usersOptions,
        countriesOptions,
        banksOptions,
        puestosOptions,
        departamentosOptions,
        colaboradoresOptions,
        isFormComplete: 
          informacionGeneralForm.formState.isValid &&
          domicilioFiscalForm.formState.isValid &&
          domicilioParticularForm.formState.isValid &&
          datosLaboralesForm.formState.isValid &&
          historialLaboralForm.formState.isValid &&
          documentacionAvalesForm.formState.isValid &&
          avalColaboradorForm.formState.isValid &&
          contactoEmergenciaForm.formState.isValid,
      }}
    >
      {children}
    </ColaboradorFormContext.Provider>
  );
};

// Hook para usar el contexto
export const useColaboradorFormContext = () => {
  const context = useContext(ColaboradorFormContext);
  if (!context) {
    throw new Error(
      "useColaboradorFormContext must be used within a ColaboradorFormProvider"
    );
  }
  return context;
};
