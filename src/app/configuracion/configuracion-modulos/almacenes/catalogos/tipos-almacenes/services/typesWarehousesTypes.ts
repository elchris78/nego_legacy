export interface TypesWarehouses {
    id: string;
    uid: string;
    estatus: boolean;
    nombre: string;
    origen?: string;
    requiereCliente?: boolean
}

export interface TypesWarehousesParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    isActive?: string[];
    origen?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateTypesWarehousesResponse extends BaseResponse { 
  id: string;
}

export interface UpdateTypesWarehousesResponse extends BaseResponse {
    id: string;
  }
  
  export interface DeleteTypesWarehousesResponse extends BaseResponse {
    id: string;
  }
  
  export interface GetTypesWarehousesResponse extends BaseResponse {
    tiposAlmacen: TypesWarehouses[];
    totalRegistros: number;
  }
  
  export interface GetTypesWarehouseResponse extends BaseResponse {
    tipoAlmacen: TypesWarehouses;
  }