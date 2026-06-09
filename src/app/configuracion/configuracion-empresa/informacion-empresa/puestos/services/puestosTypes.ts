export interface Puestos {
    uid?: string;
    id: string;
    nombre: string;
    descripcion: string;
    aplicaPara: string;
    estatus: boolean;
}

export interface PuestosParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    isActive?: string[];
    aplicapara?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreatePuestosResponse extends BaseResponse { 
  puestosId: string;
}

export interface UpdatePuestosResponse extends BaseResponse {
    puestosId: string;
  }
  
  export interface DeletePuestosResponse extends BaseResponse {
    puestosId: string;
  }
  
  export interface GetPuestosResponse extends BaseResponse {
    puestos: Puestos[];
    totalRegistros: number;
  }
  
  export interface GetPuestoResponse extends BaseResponse {
    puesto: Puestos;
  }