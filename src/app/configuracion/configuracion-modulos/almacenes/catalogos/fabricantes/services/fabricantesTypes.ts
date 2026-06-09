export interface Fabricante {
  id:                 string;
  uidFabricante:      string;
  nombre:             string;
  estatus:            boolean;
  paisClave?:         string;
  paisNombre?:        string;
  codigoPostal?:      string;
  estado?:            string;
  ciudad?:            string;
  colonia?:           string;
  calle?:             string;
  numeroExterior?:    string;
  telefono?:          string;
  correo?:            string;
  contactoAdicional?: string;
  fechaCreacion?:     string;
  fechaModificacion?: string;
  creadoPor?:         string;
}

export interface FabricanteTypeParams {
  searchQuery?: string;
  page?:        number;
  size?:        number;
  isActive?:    string[];
  paisClave?:        string[];
}

export interface Country {
  uid:                                   string;
  claveNego:                             number;
  fechaCreacion:                         string;
  fechaUltimaActualizacion:              string;
  estatus:                               boolean;
  c_Pais:                                string;
  descripcion:                           string;
  formatoCodigoPostal:                   string;
  formatoRegistroIdentidadTributaria:    string;
  validacionRegistroIdentidadTributaria: string;
  agrupaciones:                          string;
  fechaInicioVigencia:                   string;
  fechaFinVigencia:                      string | null;
}


// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateFabricanteResponse extends BaseResponse {}
export interface UpdateFabricanteResponse extends BaseResponse {}
export interface DeleteFabricanteResponse extends BaseResponse {}

export interface GetFabricantesResponse extends BaseResponse {
  fabricantes:     Fabricante[];
  totalRegistros: number;
}

export interface GetFabricanteByIdResponse extends BaseResponse {
  fabricante: Fabricante;
}
