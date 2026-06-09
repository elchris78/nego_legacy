// Base Response Interface
export interface BaseResponse {
  success: boolean;
  message: string;
}

// POST - Crear Sucursal
export interface CreateBranchRequest {
  name: string;
  postalCode: string;
  street: string;
  externalNumber: string;
  neighborhood: string;
  contactEmail: string;
  internalNumber?: string;
  phone?: string;
  responsible?: string;
  businessHours?: string;
}

export interface CreateBranchResponse extends BaseResponse {
  branchId: number;
}

// GET (Paginado y Filtrado) - Listar Sucursales
export interface GetBranchesRequest {
  pageNumber?: number;
  pageSize?: number;
  filterBy?: string;
  searchTerm?: string;
  status?: boolean | null;
  order?: 'asc' | 'desc';
}

export interface BranchDto {
  id: number;
  name: string;
  postalCode: string;
  neighborhood: string;
  status: string;
}

export interface GetBranchesResponse extends BaseResponse {
  totalRecords: number;
  branches: BranchDto[];
}

// PUT - Actualizar Sucursal
export interface UpdateBranchRequest {
  branchId: number;
  name: string;
  postalCode: string;
  street: string;
  externalNumber: string;
  neighborhood: string;
  contactEmail: string;
  internalNumber?: string;
  phone?: string;
  responsible?: string;
  businessHours?: string;
  status: boolean;
}

export interface UpdateBranchResponse extends BaseResponse {
  updatedBranchId: number;
}

// UPDATE - Toggle Activo/Inactivo
export interface ToggleBranchRequest {
  branchId: number;
  isActive: boolean;
}

export interface ToggleBranchResponse extends BaseResponse {
  toggledBranchId: number;
  currentStatus: boolean;
}

// GET (By ID) - Obtener Detalle de Sucursal
export interface GetBranchByIdRequest {
  branchId: number;
}

export interface GetBranchByIdResponse extends BaseResponse {
  branchId: number;
  name: string;
  postalCode: string;
  street: string;
  externalNumber: string;
  neighborhood: string;
  contactEmail: string;
  internalNumber?: string;
  phone?: string;
  responsible?: string;
  businessHours?: string;
  status: boolean;
  creationDate: string;
}

// DELETE (By ID) - Eliminar Sucursal
export interface DeleteBranchRequest {
  branchId: number;
}

export interface DeleteBranchResponse extends BaseResponse {
  deletedBranchId: number;
}
