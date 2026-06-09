import { Option } from "@/components/ui/multiselect";
import { PeriodoUltimoTrabajo } from "./colaboradoresFormsTypes";

export interface Colaborador {
  id:                     string;
  uid:                    string;
  estatus:                boolean;
  tipoColaborador:        string;
  tieneUsuarioSistema:    boolean;
  nombreCompleto?:        string;
  usuarioSistemaId?:      string;
  usuarioSistemaNombre?:  string;
  fechaNacimiento:        string;
  telefono:               string;
  correoElectronico:      string;
  curp:                   string;
  ine:                    string;
  archivoINEUrl:          string;
  numeroSeguroSocial:     string;
  archivoSeguroSocialUrl: string;
  conyuge:                string;
  archivoConyugeUrl:      string;
  referencias:            string;
  archivoReferenciaUrl:  string;
  referenciaBancaria:     string;
  fechaCreacion:          string;
  fechaModificacion:      string;
  domicilioFiscal?:       Domicilio;
  domicilioParticular?:   Domicilio;
  datosLaborales?:        DatosLaborales;
  historialLaboral?:      HistorialLaboral;
  contactosEmergencia?:   ContactosEmergencia[];
  avales?:                Aval[];
  documentacionAvales?:   DocumentacionAval[];
  departamento?:          string; 
  puesto?:                string;
  nombre?:                string
}

export interface Aval {
  id:              string;
  nombreCompleto:  string;
  fechaNacimiento: string;
  pais:            string;
  codigoPostal:    string;
  estado:          string;
  ciudad:          string;
  colonia:         string;
  calle:           string;
  numeroExterior:  string;
  numeroInterior:  string;
  telefono:        string;
}

export interface ContactosEmergencia {
  nombreCompleto:     string;
  telefono:           string;
  nombreBeneficiario: string;
  ineBeneficiario:    string;
  historialMedico:    string;
  notasAdicionales:   string;
}

export interface DatosLaborales {
  puesto:               string;
  departamento:         string;
  supervisorDirecto:    string;
  fechaContratacion:    string;
  fechaIngreso:         string;
  fechaFin:             string;
  horarioTrabajo:       string;
  numeroCuentaBancaria: string;
  banco:                string;
}

export interface DocumentacionAval {
  id:                           string;
  avalId:                       string;
  rfc:                          string;
  curp:                         string;
  ine:                          string;
  conyuge:                      string;
  referencias:                  string;
  constanciaSituacionFiscalUrl: string;
  referenciaFileUrl:            string;
}

export interface Domicilio {
  pais:                    string;
  codigoPostal:            string;
  estado:                  string;
  ciudad:                  string;
  colonia:                 string;
  calle:                   string;
  numeroExterior:          string;
  numeroInterior:          string;
  rfc?:                    string;
  correoBuzonTributario?:  string;
  comprobanteDomicilioUrl: string;
  rfcFileUrl?:             string;
  telefonoParticular?:     string;
}

export interface HistorialLaboral {
  ultimoTrabajo:                 string;
  periodoUltimoTrabajo:          PeriodoUltimoTrabajo;
  ultimoPuestoTrabajo:           string;
  observacionesUltimoTrabajo:    string;
  penultimoTrabajo:              string;
  periodoPenultimoTrabajo:       PeriodoUltimoTrabajo;
  penultimoPuestoTrabajo:        string;
  observacionesPenultimoTrabajo: string;
}


export type ColaboradorType = "interno" | "externo";

export interface ColaboradorParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  estatus?: string[];
  tipoColaborador?: string[];
  puestos?: string[];
  departamentos?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateColaboradorResponse extends BaseResponse {}

export interface UpdateColaboradorResponse extends BaseResponse {}

export interface DeleteColaboradorResponse extends BaseResponse {
  colaboradorId?: string;
}

export interface GetColaboradoresResponse extends BaseResponse {
  colaboradores: Colaborador[];
  totalRegistros: number;
}

export interface GetColaboradorResponse extends BaseResponse {
  colaborador: Colaborador;
}

export interface Bank {
  uid:                        string;
  claveNego:                  number;
  fechaCreacion:              string;
  fechaUltimaActualizacion:   string;
  estatus:                    boolean;
  clave:                      string;
  descripcion:                string;
  nombreRazonSocial:          string;
  rfc:                        string;
  claveInstitucionFinanciera: string;
}

export interface PostalCodeOptions {
  estados:  Location[];
  ciudades: Location[];
  colonias: Option[];
}

export interface Location {
  clave:  string;
  nombre: string;
}

export interface UnassignedUsersResponse extends BaseResponse {
  unassignedUsers: UnassignedUser[];
  totalRegistros: number;
}

export interface UnassignedUser {
  userId: string;
  userName: string;
  fullName: string;
}
