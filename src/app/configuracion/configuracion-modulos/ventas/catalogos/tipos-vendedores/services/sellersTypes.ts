export interface SellersType {
  id: string;
  uid: string;
  nombre: string;
  descripcion: string;
  estatus: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
  creadoPor?: string;
  isDeleted?: boolean;
  clave: any;
  userProvidedId: any
}

export interface SellersTypeParams {
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

export interface CreateSellersTypeResponse extends BaseResponse {}
export interface UpdateSellersTypeResponse extends BaseResponse {}
export interface DeleteSellersTypeResponse extends BaseResponse {}

export interface GetSellersTypesResponse extends BaseResponse {
  tiposVendedor: SellersType[];
  totalRegistros: number;
}

export interface GetSellerTypeByIdResponse extends BaseResponse {
  tipoVendedor: SellersType;
}