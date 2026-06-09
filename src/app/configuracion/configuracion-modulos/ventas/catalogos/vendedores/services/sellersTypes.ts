export interface Sellers {
  id: string;
  uid: string;
  nombre: string;
  colaboradorNombre: string;
  estatus: boolean;
  clave: any;
  userProvidedId: any
  tipoVendedor: string
  tipoVendedorId: string
  colaboradorId: string
  colaboradorTelefono: string
  colaboradorCorreo: string
  supervisor: string
  supervisorId: string
  zona: string
  zonaId: string
  subzona: string
  subzonaId: string
  tipoComision: string
  porcentajeComisionGlobal:number
  colaborador: string
}

export interface SellersParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  zonas?: string[];
  subzonas?: string[];
  colaboradorIds?: string[];
  tipoVendedorIds?: string[];
  supervisorIds?: string[];
  tipoComision?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateSellersResponse extends BaseResponse {}
export interface UpdateSellersResponse extends BaseResponse {}
export interface DeleteSellersResponse extends BaseResponse {}

export interface GetSellersResponse extends BaseResponse {
  vendedores: Sellers[];
  totalRegistros: number;
}

export interface GetSellerByIdResponse extends BaseResponse {
  vendedor: Sellers;
}