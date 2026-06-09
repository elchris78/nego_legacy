/******************************************** Datos generales *****************************************************/

//* Datos de la empresa
export interface DatosGeneralesEmpresaForm {
  codigoPostal: string;
  pais: string;
  estado: string;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  curp: string;
  registroPatronalIMSS: string;
  tieneDatosFiscales: boolean;
}

//* Datos comerciales
export interface DatosComercialesEmpresaForm {
  logoGeneral: File | null;
  nombreComercial: string;
  telefonoFijo: string;
  telefonoCelular: string;
  correoContacto: string;
  paginaWeb: string;
  // monedaBase: string;
}

/******************************************** Datos fiscales *****************************************************/
// * Datos fiscales
export interface datosFiscalesEmpresaForm {
  pais: string;
  codigoPostal: string;
  estado: string;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  rfc: string;
  regimenFiscal: string;
  archivoSelloDigital: File | null;
  archivoLlavePrivada: File | null;
  contrasenaSello: string;
  fechaVigenciaSello: string;
}

/******************************************** Catálogos *****************************************************/
export interface RegimenFiscal {
  uid:                         string;
  claveNego:                   number;
  fechaCreacion:               string;
  fechaUltimaActualizacion:    string;
  estatus:                     boolean;
  c_RegimenFiscal:             string;
  descripcion:                 string;
  aplicaParaTipoPersonaFisica: string;
  aplicaParaTipoPersonaMoral:  string;
  fechaInicioVigencia:         string;
  fechaFinVigencia:            string;
}

export interface Moneda {
  uid:                      string;
  claveNego:                number;
  fechaCreacion:            string;
  fechaUltimaActualizacion: string;
  estatus:                  boolean;
  c_Moneda:                 string;
  descripcion:              string;
  decimales:                number;
  porcentajeVariacion:      number;
  fechaInicioVigencia:      string;
  fechaFinVigencia:         string;
}

