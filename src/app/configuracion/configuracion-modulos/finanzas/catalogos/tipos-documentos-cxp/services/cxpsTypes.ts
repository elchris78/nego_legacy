// CXP Types
// Base Response Interface
export interface BaseResponse {
  success: boolean;
  message: string;
}

// Base Params Interface para LOCAL, aqui maneja el isActive + origen como un string[]
export interface CXPParams {
  searchQuery?: string;
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: string[]; // Array de strings para manejar múltiples valores
  origen?: string[]; // Array de strings para manejar múltiples valores
}

// Cuentas por pagar DTO
export interface CXP {
  id: string;
  tipoDocumento: string;
  estatus: boolean;
  origen: string;
  fechaCreacion: string;       // ISO 8601
  fechaModificacion: string;   // ISO 8601
  creadoPor: string;
}

//////////////////////////////////////////////////////////////////////////////////////
//#region Peticiones GET, POST, PUT, DELETE para Cuentas por pagar
//////////////////////////////////////////////////////////////////////////////////////


// GET (Paginado y Filtrado) - Listar cuentas por pagar
export interface GetCXPRequest {
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: boolean;
  searchQuery?: string;
  origen?: string
}

export interface GetCXPResponse extends BaseResponse {
  totalRegistros: number;
  tipoDocumentos: CXP[];
}

// GET (By ID) - Obtener Detalle de Cuentas por pagar
export interface GetCXPByIdRequest {
  id: string;
}

export interface GetCXPByIdResponse extends BaseResponse {
  tipoDocumento: CXP;
}

// POST - Crear Cuentas por pagar
export interface CreateCXPRequest {
  userProvidedId?: string; // Opcional, si se quiere asignar un ID específico
  userProvidedPrefix?: string; // Opcional, si se quiere asignar un prefijo específico
  tipoDocumento: string;
  estatus: boolean;
}

export interface CreateCXPResponse extends BaseResponse {
  id: string; // ID del nuevo documento creado
}

// PUT - Actualizar Cuentas por pagar
export interface UpdateCXPRequest {
  tipoDocumento: string;
  estatus: boolean;
}

export interface UpdateCXPResponse extends BaseResponse {
  id: string;
}

// Delete (By ID) - Elimina Detalle de Cuentas por pagar
export interface DeleteCXPRequest {
  id: string;
}

export interface DeleteCXPResponse extends BaseResponse {
  id: string;
}

// UPDATE - PATCH - Toggle Activo/Inactivo
export interface ToggleCXPRequest {
  id: string;
}

export interface ToggleCXPResponse extends BaseResponse {
  id: string;
}

//////////////////////////////////////////////////////////////////////////////////////
// Exportaciones e importaciones de los de datos (Excel y PDF)
//////////////////////////////////////////////////////////////////////////////////////

// GET - Exportar Cuentas por pagar a Excel
export interface ExportCXPRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
  origen?: string;
}

export interface ExportCXPResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// GET - Exportar Cuentas por pagar a PDF
export interface ExportCXPPDFRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
  origen?: string;
}

export interface ExportCXPPDFResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// Post - Importar Cuentas por pagar desde Excel
export interface ImportCXPRequest {
  file: File;
}

export interface ImportCXPResponse extends BaseResponse {
  importedCount: number;
  failedCount: number;
  results: ImportResults[];
}

export interface ImportResults {
  rowNumber: number;
  status: string;
  message: string;
}

//#endregion Peticiones GET, POST, PUT, DELETE para Cuentas por pagar