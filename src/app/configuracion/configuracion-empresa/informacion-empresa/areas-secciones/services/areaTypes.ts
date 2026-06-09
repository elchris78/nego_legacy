export interface Area {
  uidArea?: string;
  id: string;
  nombre: string;
  nombreResponsable: string;
  descripcion: string;
  estatus: boolean;
  idResponsable?: string;
  creadoPor?: string;
  isDeleted?: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface AreaParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  responsibleId?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateAreaResponse extends BaseResponse {}

export interface UpdateAreaResponse extends BaseResponse {}

export interface DeleteAreaResponse extends BaseResponse {
  areaId: string;
}

export interface GetAreasResponse extends BaseResponse {
  areas: Area[];
  totalRegistros: number;
}

export interface GetAreaResponse extends BaseResponse {
  area: Area;
}
