export interface KeyConfiguration {
  id: string;
  uidConfiguration: number
  modulo: string;
  catalogo: string;
  tipoId: string;
  tipoClave: string;
  tienePrefijo: boolean;
  tipoPrefijo: string;
  prefijo: string;
  longitudMaxima: string
  isEmpty?: boolean
}

export interface KeyConfigurationParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  Modulo?: string[];
  Catalogo?: string[];
  TipoClave?: string[];
  TipoPrefijo?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateKeyConfigurationResponse extends BaseResponse {}
export interface UpdateKeyConfigurationResponse extends BaseResponse {}
export interface DeleteKeyConfigurationResponse extends BaseResponse {}

export interface GetKeyConfigurationResponse extends BaseResponse {
  catalogs: KeyConfiguration[];
  totalRegistros: number;
}

export interface GetKeyConfiguratiByIdResponse extends BaseResponse {
  catalog: KeyConfiguration;
}

export interface CatsType {
  label: string
  value: string
} 

export interface GetCatsType  {
  catalogos: CatsType[];
  tiposClave: CatsType[];
}

export interface GetCatalogoClave {
  uidConfiguration?:  number,
  fechaCreacion?: string,
  modulo?: string,
  catalogo?: string,
  tipoClave?: string,
  tienePrefijo?: true,
  tipoPrefijo?: string,
  prefijo?: string,
  longitudMaxima?: number,
  isDeleted?: boolean,
  isEmpty?: boolean
}

export interface GetCatalogoClaveParams {
  catalogo?: string;
}