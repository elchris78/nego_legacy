// Base Response Interface
export interface BaseResponse {
  success: boolean;
  message: string;
}

// Base Params Interface para LOCAL, aqui maneja el isActive como un string[]
export interface ClientSubclassificationParams {
  searchQuery?: string;
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: string[]; // Array de strings para manejar múltiples valores
}

// Subclasification DTO
export interface ClientSubclassification {
  uid?: string;
  id: string;
  nombre: string;
  descripcion: string;
  estatus: boolean;
  fechaCreacion: string;       // ISO 8601
  fechaModificacion: string;   // ISO 8601
  creadoPor: string;
  isDeleted: boolean;
}

//////////////////////////////////////////////////////////////////////////////////////
//#region Peticiones GET, POST, PUT, DELETE para Subclasificaciones de Clientes
//////////////////////////////////////////////////////////////////////////////////////


// GET (Paginado y Filtrado) - Listar Subclasificaciones
export interface GetClientSubclassificationRequest {
  size?: number; // Default: 0
  page?: number; // Default: 0
  isActive?: string[];
  searchQuery?: string;
}

export interface GetClientSubclassificationResponse extends BaseResponse {
  totalRegistros: number;
  subclasificacionesClientes: ClientSubclassification[];
}

// GET (By ID) - Obtener Detalle de Subclasificación
export interface GetClientSubclassificationByIdRequest {
  id: string;
}

export interface GetClientSubclassificationByIdResponse extends BaseResponse {
  subclasificacionCliente: ClientSubclassification;
}

// POST - Crear Subclasificación
export interface CreateClientSubclassificationRequest {
  nombre: string;
  descripcion: string;
  estatus: boolean;
}

export interface CreateClientSubclassificationResponse extends BaseResponse {
}

// PUT - Actualizar Subclasificación
export interface UpdateClientSubclassificationRequest {
  nombre: string;
  descripcion: string;
  estatus: boolean;
}

export interface UpdateClientSubclassificationResponse extends BaseResponse {
}

// Delete (By ID) - Elimina Detalle de Subclasificación
export interface DeletClientSubclassificationRequest {
  id: string;
}

export interface DeleteClientSubclassificationResponse extends BaseResponse {
}

// UPDATE - Toggle Activo/Inactivo
export interface ToggleClientSubclassificationRequest {
  id: number;
}

export interface ToggleClientSubclassificationResponse extends BaseResponse {
}

//////////////////////////////////////////////////////////////////////////////////////
// Exportaciones e importaciones de los de datos (Excel y PDF)
//////////////////////////////////////////////////////////////////////////////////////

// GET - Exportar Subclasificaciones a Excel
export interface ExportClientSubclassificationRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
}

export interface ExportClientSubclassificationResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// GET - Exportar Subclasificaciones a PDF
export interface ExportClientSubclassificationPDFRequest {
  page?: number;
  size?: number;
  isActive?: boolean;
  searchQuery?: string;
}

export interface ExportClientSubclassificationPDFResponse extends BaseResponse {
  fileName: string;
  filePath: string;
}

// Post - Importar Subclasificaciones desde Excel
export interface ImportClientSubclassificationRequest {
  file: File;
}

export interface ImportClientSubclassificationResponse extends BaseResponse {
  importedCount: number;
  failedCount: number;
  results: ImportResults[];
}

export interface ImportResults {
  rowNumber: number;
  status: string;
  message: string;
}

//#endregion Peticiones GET, POST, PUT, DELETE para Subclasificaciones de Clientes