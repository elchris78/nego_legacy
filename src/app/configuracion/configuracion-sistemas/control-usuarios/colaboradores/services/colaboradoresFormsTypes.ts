/******************************************** Datos generales *****************************************************/

//* Información general
export interface InformacionGeneralColaboradorForm {
  userProvidedId: string;
  userProvidedPrefix?: string;
  estatus: string;
  tipoColaborador: string;
  tieneUsuarioSistema: string;
  nombreCompleto?: string;
  usuarioSistemaId?: string;
  fechaNacimiento: string;
  telefono: string;
  correoElectronico: string;
  curp: string;
  archivoINE: File;
  ine: string;
  numeroSeguroSocial: string;
  archivoSeguroSocial: File;
  conyuge: string;
  archivoConyuge: File;
  archivoReferencia: File;
  referencias: string;
  referenciaBancaria: string;
}

//* Domicilio fiscal
export interface DomicilioFiscalColaboradorForm {
  pais: string;
  codigoPostal: string;
  estado: string;
  ciudad: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  rfc: string;
  rfcFile: File;
  correoBuzonTributario: string;
  comprobanteDomicilioFile: File;
}

//* Domicilio particular
export interface DomicilioParticularColaboradorForm {
  pais: string;
  codigoPostal: string;
  estado: string;
  ciudad: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  telefonoParticular: string;
  comprobanteDomicilioFile: File;
}

/******************************************** Información laboral *****************************************************/
//* Datos laborales
export interface DatosLaboralesColaboradorForm {
  puesto: string;
  departamento: string;
  supervisorDirecto: string;
  fechaContratacion: string;
  fechaIngreso: string;
  fechaFin: string;
  horarioTrabajo: string;
  numeroCuentaBancaria: string;
  banco: string;
}

//* Historial laboral
export interface HistorialLaboralColaboradorForm {
  ultimoTrabajo: string;
  periodoUltimoTrabajo: PeriodoUltimoTrabajo;
  ultimoPuestoTrabajo: string;
  observacionesUltimoTrabajo: string;
  penultimoTrabajo: string;
  periodoPenultimoTrabajo: PeriodoUltimoTrabajo;
  penultimoPuestoTrabajo: string;
  observacionesPenultimoTrabajo: string;
}

export interface PeriodoUltimoTrabajo {
  from: string | undefined;
  to:   string | undefined;
}

//* Contacto de emergencia
export interface ContactoEmergencia {
  nombreCompleto: string;
  telefono: string;
  nombreBeneficiario: string;
  ineBeneficiario: string;
  historialMedico: string;
  notasAdicionales: string;
}

export type ContactoEmergenciaFormValues = {
  contactosEmergencia: ContactoEmergencia[];
};

// * Avales
export interface AvalColaborador {
  id?: string // Identificador único del aval (para edición)
  nombreCompleto: string;
  fechaNacimiento: string;
  pais: string;
  codigoPostal: string;
  estado: string;
  ciudad: string; 
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  telefono: string;
}

export type AvalColaboradorFormValues = {
  avales: AvalColaborador[];
}

// * Documentación avales
export interface DocumentacionAvalesColaboradorForm {
  id?: string; // Identificador único del aval (para edición)
  rfc: string;
  constanciaSituacionFiscalFile: File | null;
  curp: string;
  ine: string;
  conyuge: string;
  referenciaFile: File | null;
}

export type DocumentacionAvalesColaboradorFormValues = {
  documentacionAvales: DocumentacionAvalesColaboradorForm[];
};
