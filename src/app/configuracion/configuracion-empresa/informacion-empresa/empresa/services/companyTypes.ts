// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface EmpresaResponse extends BaseResponse {
  company: Company;
  id:      string;
}

export interface Company {
  companyId:          number;
  name:               string;
  normalizedName:     string;
  datosEmpresa:       DatosEmpresa;
  datosComerciales:   DatosComerciales;
  datosFiscales:      DatosFiscales;
  success:            boolean;
  message:            string;
  id:                 null;
}

export interface DatosEmpresa {
  id:                   number;
  pais:                 string;
  codigoPostal:         string;
  estado:               string;
  municipio:            string;
  localidad:            string;
  colonia:              string;
  calle:                string;
  numeroExterior:       string;
  numeroInterior:       string;
  curp:                 string;
  registroPatronalIMSS: string;
  tieneDatosFiscales:   boolean;
  empresaId:            number;
}


export interface DatosComerciales {
  id:              number;
  logoGeneral:     string;
  nombreComercial: string;
  telefonoFijo:    string;
  telefonoCelular: string;
  correoContacto:  string;
  paginaWeb:       string;
  empresaId:       number;
}

export interface DatosFiscales {
  id:                  number;
  pais:                string;
  codigoPostal:        string;
  estado:              string;
  municipio:           string;
  localidad:           string;
  colonia:             string;
  calle:               string;
  numeroExterior:      string;
  numeroInterior:      string;
  rfc:                 string;
  regimenFiscal:       string;
  archivoSelloDigital: string;
  archivoLlavePrivada: string;
  contrasenaSello:     string;
  fechaVigenciaSello:  string;
  empresaId:           number;
}

