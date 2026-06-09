// CXC Types
// Base Response Interface
export interface BaseResponse {
  success: boolean;
  message: string;
}

// Base Params Interface para LOCAL, aqui maneja el isActive como un string[]
export interface CXCParams {
  searchQuery?: string;
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: string[]; // Array de strings para manejar múltiples valores
  origen?: string[]
}

// Cuentas por cobrar DTO
export interface CXC {
  id: string;
  tipoDocumento: string;
  estatus: boolean;
  origen: string;
  fechaCreacion: string;       // ISO 8601
  fechaModificacion: string;   // ISO 8601
  creadoPor: string;
}

//////////////////////////////////////////////////////////////////////////////////////
//#region Peticiones GET, POST, PUT, DELETE para Cuentas por cobrar
//////////////////////////////////////////////////////////////////////////////////////


// GET (Paginado y Filtrado) - Listar cuentas por cobrar
export interface GetCXCRequest {
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: boolean;
  searchQuery?: string;
  origen?: string
}

export interface GetCXCResponse extends BaseResponse {
  totalRegistros: number;
  tipoDocumentos: CXC[];
}

// GET (By ID) - Obtener Detalle de Cuentas por cobrar
export interface GetCXCByIdRequest {
  id: string;
}

export interface GetCXCByIdResponse extends BaseResponse {
  tipoDocumento: CXC;
}

// POST - Crear Cuentas por cobrar
export interface CreateCXCRequest {
  userProvidedId?: string; // Opcional, si se quiere asignar un ID específico
  userProvidedPrefix?: string; // Opcional, si se quiere asignar un prefijo específico
  tipoDocumento: string;
  estatus: boolean;
}

export interface CreateCXCResponse extends BaseResponse {
  id: string; // ID del nuevo documento creado
}

// PUT - Actualizar Cuentas por cobrar
export interface UpdateCXCRequest {
  tipoDocumento: string;
  estatus: boolean;
}

export interface UpdateCXCResponse extends BaseResponse {
  id: string;
}

// Delete (By ID) - Elimina Detalle de Cuentas por cobrar
export interface DeleteCXCRequest {
  id: string;
}

export interface DeleteCXCResponse extends BaseResponse {
  id: string;
}

// UPDATE - PATCH - Toggle Activo/Inactivo
export interface ToggleCXCRequest {
  id: string;
}

export interface ToggleCXCResponse extends BaseResponse {
  id: string;
}

//////////////////////////////////////////////////////////////////////////////////////
// Exportaciones e importaciones de los de datos (Excel y PDF)
//////////////////////////////////////////////////////////////////////////////////////

// GET - Exportar Cuentas por cobrar a Excel
export interface ExportCXCRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
  origen?: string;
}

export interface ExportCXCResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// GET - Exportar Cuentas por cobrar a PDF
export interface ExportCXCPDFRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
  origen?: string;
}

export interface ExportCXCPDFResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// Post - Importar Cuentas por cobrar desde Excel
export interface ImportCXCRequest {
  file: File;
}

export interface ImportCXCResponse extends BaseResponse {
  importedCount: number;
  failedCount: number;
  results: ImportResults[];
}

export interface ImportResults {
  rowNumber: number;
  status: string;
  message: string;
}

//#endregion Peticiones GET, POST, PUT, DELETE para Cuentas por cobrar