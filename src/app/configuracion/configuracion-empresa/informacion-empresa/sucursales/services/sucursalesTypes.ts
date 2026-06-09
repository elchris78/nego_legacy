export interface Sucursal {
  id: string;
  uidSucursal?: string;
  userProvidedId?: any;
  nombre: string;
  telefono: string;
  responsablePrincipal: string;
  responsablePrincipalNombre: string;
  responsableSecundario?: string;
  responsableSecundarioNombre: string;
  horarioAtencion?: string;
  correoContacto: string;
  zonaId?: string;
  subzonaId?: string;
  estatus?: boolean;

  // Archivos (formato multipart)
  imagen?: string;
  //imagen?: File | string;
  comprobanteFiscal?: File | string;
  comprobanteAlterno?: File | string;

  // Agrupación anidada:
  domicilioFiscal: DomicilioFiscal;
  domicilioParticular?: DomicilioParticular;
}

export interface DomicilioFiscal {
  pais: string;
  paisNombre: string;
  codigoPostal: string;
  estado: string
  ciudad: string
  estadoNombre: string
  ciudadNombre?: string
  colonia: string;
  coloniaCode: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  comprobanteDomicilio: string;
  telefono?: string;
}

export interface DomicilioParticular {
  pais: string;
  paisNombre: string;
  codigoPostal: string;
  estado: string
  estadoNombre: string
  ciudadNombre?: string
  colonia: string;
  coloniaCode: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  comprobanteDomicilio: string;
  telefonoParticular?: string;
}


export interface SucursalesParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  responsableId?: string[];
  pais?: string[];
  codigoPostal?: string[];
  estado?: string[];
  ciudad?: string[];
  colonia?: string[]
}

export interface AddDocumentSucursal {
  id: string;
  sucursalId: string;
  nombreDocumento: string;
  rutaArchivo?: string;
  formato?: string;
  fechaRegistro?: string;
  isDeleted?: boolean;
}


export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateSucursalResponse extends BaseResponse {}
export interface AddDocumentSucursalResponse extends BaseResponse {}
export interface UpdateSucursalResponse extends BaseResponse {}
export interface DeleteSucursalResponse extends BaseResponse {}
export interface DeleteSucursalDocResponse extends BaseResponse {}

export interface GetSucursalResponse extends BaseResponse {
  sucursales: Sucursal[];
  totalRegistros: number;
}

export interface GetDocumentByIdRequest {
  id: string;
}

export interface GetSucursalByIdResponse extends BaseResponse {
  sucursal: Sucursal;
}

export interface GetDocumentByIdsResponse extends BaseResponse {
  documento: AddDocumentSucursal;
}

export interface GetDocumentByIdResponse extends BaseResponse {
  documentos: AddDocumentSucursal[];
  totalRegistros: number;
}

export interface CreateSucursalResponse extends BaseResponse {
  id: string;
}