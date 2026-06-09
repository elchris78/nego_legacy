/******************************************** Datos generales *****************************************************/

//* Información general
export interface InformacionGeneralSucursalesForm {
  UserProvidedId?: string;
  UserProvidedPrefix?: string;
  Nombre: string;
  Telefono: string;
  ResponsablePrincipal: string;
  ResponsableSecundario?: string;
  HorarioAtencion?: string;
  CorreoContacto: string;
  ZonaId?: string;
  SubzonaId?: string;
  estatus?: string;

  // Archivos (formato multipart)
  Imagen?: File | string;
  ComprobanteFiscal?: File | string;
  ComprobanteAlterno?: File | string;
}

//* Domicilio fiscal
export interface DomicilioFiscalSucursalesForm {
  Pais?: string;
  ciudad?: string
  CiudadNombre?: string;
  EstadoNombre?: string;
  CodigoPostal?: string;
  Colonia?: string;
  Calle?: string;
  NumeroExterior?: string;
  NumeroInterior?: string;
  ComprobanteDomicilio?: string;
  Telefono?: string;

}

//* Domicilio particular
export interface DomicilioParticularSucursalesForm {
  Pais?: string;  
  ciudad?: string
  CiudadNombre?: string;
  EstadoNombre?: string;
  CodigoPostal?: string;
  Colonia?: string;
  Calle?: string;
  NumeroExterior?: string;
  NumeroInterior?: string;
  ComprobanteDomicilio?: string;
  TelefonoParticular?: string;
}


