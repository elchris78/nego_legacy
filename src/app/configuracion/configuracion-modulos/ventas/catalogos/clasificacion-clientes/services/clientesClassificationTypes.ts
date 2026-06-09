export interface ClientClassification {
  uidClasificacion?: string;
  id: string;
  nombre: string;
  descripcion?: string;
  estatus: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
  creadoPor?: string;
  isDeleted?: boolean;
}

export interface ClientClassificationParams {
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

export interface CreateClientClassificationResponse extends BaseResponse {}
export interface UpdateClientClassificationResponse extends BaseResponse {}
export interface DeleteClientClassificationResponse extends BaseResponse {}
export interface GetClientClassificationsResponse extends BaseResponse {
  clasificaciones: ClientClassification[];
  totalRegistros: number;
}
export interface GetClientClassificationResponse extends BaseResponse {
  clasificacion: ClientClassification;
}
