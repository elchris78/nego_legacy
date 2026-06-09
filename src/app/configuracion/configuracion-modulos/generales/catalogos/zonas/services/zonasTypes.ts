export interface Zona {
  uidZona:            number;
  id:                 string;
  estatus:            boolean;
  nombre:             string;
  descripcion:        string;
  fechaCreacion?:     string;
  fechaModificacion?: string;
  creadoPor?:         string;
  isDeleted?:         boolean;
}

export interface ZonaTypeParams {
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

export interface CreateZonaResponse extends BaseResponse {}
export interface UpdateZonaResponse extends BaseResponse {}
export interface DeleteZonaResponse extends BaseResponse {}

export interface GetZonasResponse extends BaseResponse {
  zonas: Zona[];
  totalRegistros: number;
}

export interface GetZonaByIdResponse extends BaseResponse {
  zona: Zona;
}
