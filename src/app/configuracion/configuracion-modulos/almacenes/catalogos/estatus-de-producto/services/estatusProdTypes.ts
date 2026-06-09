export interface Estatus {
    id: string;
    uid: string;
    estatus: boolean;
    nombre: string
}

export interface EstatusProdParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    isActive?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateEstatusResponse extends BaseResponse { 
  estatusId: string;
}

export interface UpdateEstatusResponse extends BaseResponse {
    estatusId: string;
  }
  
  export interface DeleteEstatusResponse extends BaseResponse {
    estatusId: string;
  }
  
  export interface GetEstatusResponse extends BaseResponse {
    estatusProductos: Estatus[];
    totalRegistros: number;
  }
  
  export interface GetEstatuResponse extends BaseResponse {
    estatusProducto: Estatus;
  }