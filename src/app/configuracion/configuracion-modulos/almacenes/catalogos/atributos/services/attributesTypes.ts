// Attribute Types
// Base Response Interface
export interface BaseResponse {
  success: boolean;
  message: string;
}

// Base Params Interface para LOCAL, aqui maneja el isActive como un string[]
export interface AttributeParams {
  searchQuery?: string;
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: string[]; // Array de strings para manejar múltiples valores
}

// Atributo DTO
export interface Attribute {
  uid?: string;
  id: string;
  nombre: string;
  valores: string;
  estatus: boolean;
  fechaCreacion: string;       // ISO 8601
  fechaModificacion: string;   // ISO 8601
  creadoPor: string;
  isDeleted: boolean;
}

//////////////////////////////////////////////////////////////////////////////////////
//#region Peticiones GET, POST, PUT, DELETE para Atributos
//////////////////////////////////////////////////////////////////////////////////////


// GET (Paginado y Filtrado) - Listar atributos
export interface GetAttributeRequest {
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: boolean;
  searchQuery?: string;
}

export interface GetAttributeResponse extends BaseResponse {
  totalRegistros: number;
  atributosCompletos: Attribute[];
}

// GET (By ID) - Obtener Detalle de Atributo
export interface GetAttributeByIdRequest {
  id: string;
}

export interface GetAttributeByIdResponse extends BaseResponse {
  atributoIndividual: Attribute;
}

// POST - Crear Atributo
export interface CreateAttributeRequest {
  userProvidedId?: string; // Opcional, si se quiere asignar un ID específico
  userProvidedPrefix?: string; // Opcional, si se quiere asignar un prefijo específico
  nombre: string;
  estatus: boolean;
}

export interface CreateAttributeResponse extends BaseResponse {
  id: string; // ID del nuevo atributo creado
}

// PUT - Actualizar Atributo
export interface UpdateAttributeRequest {
  nombre: string;
  estatus: boolean;
}

export interface UpdateAttributeResponse extends BaseResponse {
}

// Delete (By ID) - Elimina Detalle de Atributo
export interface DeletAttributeRequest {
  id: string;
}

export interface DeleteAttributeResponse extends BaseResponse {
}

// UPDATE - Toggle Activo/Inactivo
export interface ToggleAttributeRequest {
  id: string;
}

export interface ToggleAttributeResponse extends BaseResponse {
}

//////////////////////////////////////////////////////////////////////////////////////
// Exportaciones e importaciones de los de datos (Excel y PDF)
//////////////////////////////////////////////////////////////////////////////////////

// GET - Exportar Atributos a Excel
export interface ExportAttributeRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
}

export interface ExportAttributeResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// GET - Exportar Atributos a PDF
export interface ExportAttributePDFRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
}

export interface ExportAttributePDFResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// Post - Importar Atributos desde Excel
export interface ImportAttributeRequest {
  file: File;
}

export interface ImportAttributeResponse extends BaseResponse {
  importedCount: number;
  failedCount: number;
  results: ImportResults[];
}

export interface ImportResults {
  rowNumber: number;
  status: string;
  message: string;
}

//#endregion Peticiones GET, POST, PUT, DELETE para Atributos