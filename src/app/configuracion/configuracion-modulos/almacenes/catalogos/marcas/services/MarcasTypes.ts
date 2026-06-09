export interface Marcas {
    id: string;
    uid: string;
    claveMarca: string;
    estatus: boolean;
    marcas: string
    nombre:string
    fabricante: string
    logoUrl: string;
    fechaCreacion: string;
    fechaVigencia: string;
    fabricanteId: string
}

export interface MarcasParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    isActive?: string[];
    fabricante?: string[];
    fechaVigencia?: string;
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateMarcasResponse extends BaseResponse { 
  marcasId: string;
}

export interface UpdateMarcasResponse extends BaseResponse {
    marcasId: string;
  }
  
  export interface DeleteMarcasResponse extends BaseResponse {
    marcasId: string;
  }
  
  export interface GetMarcasResponse extends BaseResponse {
    marcas: Marcas[];
    totalRegistros: number;
  }
  
  export interface GetMarcaResponse extends BaseResponse {
    marca: Marcas;
  }