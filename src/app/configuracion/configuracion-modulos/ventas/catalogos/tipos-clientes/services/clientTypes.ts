export interface ClientType {
  id: string;
  uid: string;
  nombre: string;
  descripcion: string;
  estatus: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
  creadoPor?: string;
  isDeleted?: boolean;
}

export interface ClientTypeParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateClientTypeResponse extends BaseResponse {}
export interface UpdateClientTypeResponse extends BaseResponse {}
export interface DeleteClientTypeResponse extends BaseResponse {}

export interface GetClientTypesResponse extends BaseResponse {
  tipoClientes: ClientType[];
  totalRegistros: number;
}

export interface GetClientTypeByIdResponse extends BaseResponse {
  tipoCliente: ClientType;
}