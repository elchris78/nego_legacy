export interface TipoAlmacenaje {
    id: string;
    uid: string;
    estatus: boolean;
    tipo: string;
}

export interface TipoAlmacenajeParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    isActive?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateTiposAlmacenajeResponse extends BaseResponse { 
  id: string;
}

export interface UpdateTiposAlmacenajeResponse extends BaseResponse {
    id: string;
  }
  
  export interface DeleteTiposAlmacenajeResponse extends BaseResponse {
    id: string;
  }
  
  export interface GetTiposAlmacenajeResponse extends BaseResponse {
    tipoAlmacenajes: TipoAlmacenaje[];
    totalRegistros: number;
  }
  
  export interface GetTipoAlmacenajeResponse extends BaseResponse {
    tipoAlmacenaje: TipoAlmacenaje;
  }