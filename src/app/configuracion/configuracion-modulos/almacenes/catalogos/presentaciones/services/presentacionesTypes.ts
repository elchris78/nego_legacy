export interface Presentaciones {
    uid?: string;
    id: string;
    estatus: boolean;
    descripcion: string
    nombre:string
}

export interface PresentacionesParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    isActive?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreatePresentacionesResponse extends BaseResponse { 
  presentacionesId: string;
}

export interface UpdatePresentacionesResponse extends BaseResponse {
    presentacionesId: string;
  }
  
  export interface DeletePresentacionesResponse extends BaseResponse {
    presentacionesId: string;
  }
  
  export interface GetPresentacionesResponse extends BaseResponse {
    presentaciones: Presentaciones[];
    totalRegistros: number;
  }
  
  export interface GetPresentacionResponse extends BaseResponse {
    presentacion: Presentaciones;
  }