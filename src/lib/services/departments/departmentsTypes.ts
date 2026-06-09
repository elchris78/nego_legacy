// Base Response Interface
export interface BaseResponse {
  success: boolean;
  message: string;
}

// POST - Crear Departamento
export interface CreateDepartmentRequest {
  claveDepartamento?: string;
  prefix?: string;
  name: string;
  area?: string;
  description?: string;
  responsible?: string;
  isActive: string;
}

export interface CreateDepartmentResponse extends BaseResponse {
  departmentId: number;
}

// GET (Paginado y Filtrado) - Listar Departamentos
export interface GetDepartmentsRequest {
  PageNumber?: number; // Default: 1
  PageSize?: number; // Default: 10
  SearchTerm?: string; // Término general
  Areas?: string[]; // Área de Departamento
  Names?: string[]; // Nombre de Departamento
  Status?: string[]; // Activo/Inactivo
  Responsibles?: string[]; // ID de Responsable
}

export interface DepartmentDto {
  id:           string;
  name:         string;
  area?:        string;
  areaId?:     string;
  creationDate: string;
  status:       boolean;
  responsible?: string;
  responsibleId?: string;
  description?: string;
}

export interface GetDepartmentsResponse extends BaseResponse {
  totalRecords: number;
  departments: DepartmentDto[];
}

// PUT - Actualizar Departamento
export interface UpdateDepartmentRequest {
  departmentId: number;
  name: string;
  area?: string;
  description?: string;
  responsible?: string;
  status: boolean;
}

export interface UpdateDepartmentResponse extends BaseResponse {
  updatedDepartmentId: number;
}

// UPDATE - Toggle Activo/Inactivo
export interface ToggleDepartmentRequest {
  departmentId: string;
  isActive: boolean;
}

export interface ToggleDepartmentResponse extends BaseResponse {
  toggledDepartmentId: string;
  currentStatus: boolean;
}

// GET (By ID) - Obtener Detalle de Departamento
export interface GetDepartmentByIdRequest {
  departmentId: string;
}

export interface GetDepartmentByIdResponse extends BaseResponse {
  departmentId: string;
  name: string;
  area: string;
  description: string;
  responsible: string;
  status: boolean;
  creationDate: Date;
}

// Delete (By ID) - Elimina Detalle de Departamento
export interface DeleteDepartmentRequest {
  departmentId: string;
}

export interface DeleteDepartmentResponse extends BaseResponse {
  deletedDepartmentId: string;
}

export interface modulesSubmodules {
  modules?: string[] | null;
  submodules?: string[] | null;
}