export interface SubZona {
  uidSubZona:         number;
  id:                 string;
  estatus:            boolean;
  nombre:             string;
  descripcion:        string;
  zonaNombre:         string;
  zonaId:             string;
  fechaCreacion?:     string;
  fechaModificacion?: string;
  creadoPor?:         string;
  isDeleted?:         boolean;
}

export interface SubZonaTypeParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  zonaClave?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateSubZonaResponse extends BaseResponse {}
export interface UpdateSubZonaResponse extends BaseResponse {}
export interface DeleteSubZonaResponse extends BaseResponse {}

export interface GetSubZonasResponse extends BaseResponse {
  subZonas: SubZona[];
  totalRegistros: number;
}

export interface GetSubZonaByIdResponse extends BaseResponse {
  subZona: SubZona;
}