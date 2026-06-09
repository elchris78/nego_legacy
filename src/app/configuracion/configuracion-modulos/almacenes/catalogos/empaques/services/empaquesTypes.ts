export interface Empaque {
  id:                 string;
  uid:                string;
  estatus:            boolean;
  descripcion:        string;
  unidadSat:          string;
  unidadSatId:        string;
  fechaCreacion?:     string;
  fechaModificacion?: string;
  creadoPor?:         string;
  isDeleted?:         boolean;
}

export interface EmpaqueTypeParams {
  searchQuery?: string;
  page?:        number;
  size?:        number;
  isActive?:    string[];
  unidadSat?:   string[];
}

export interface UnidadPesoSat {
  uid:                      string;
  claveNego:                number;
  fechaCreacion:            string;
  fechaUltimaActualizacion: string;
  estatus:                  boolean;
  claveUnidad:              string;
  nombre:                   string;
  descripcion:              string;
  nota:                     string;
  fechaInicioVigencia:      Date;
  fechaFinVigencia:         Date;
  simbolo:                  string;
  bandera:                  string;
}


// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateEmpaqueResponse extends BaseResponse {}
export interface UpdateEmpaqueResponse extends BaseResponse {}
export interface DeleteEmpaqueResponse extends BaseResponse {}

export interface GetEmpaquesResponse extends BaseResponse {
  empaques:       Empaque[];
  totalRegistros: number;
}

export interface GetEmpaqueByIdResponse extends BaseResponse {
  empaque: Empaque;
}
