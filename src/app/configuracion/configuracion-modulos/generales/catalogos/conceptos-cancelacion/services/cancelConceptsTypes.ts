export interface CancelConcepts {
    uid: string;
    id: string;
    concepto: string;
    afectaA?: string;
    motivoSat?: string;
    estatus: boolean;
    createdAt?: string;
    motivoSatId?: string
  }
  
export interface CancelConceptsParams {
  searchQuery?: string;
  page?: number;
  size?: number; 
  isActive?: string[];
  affectTo?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateCancelConceptsResponse extends BaseResponse { 
  cancelConceptsId: string;
}

export interface UpdateCancelConceptsResponse extends BaseResponse {
  cancelConceptsId: string;
}
  
export interface DeleteCancelConceptsResponse extends BaseResponse {
  cancelConceptsId: string;
}
  
export interface GetCancelConceptsResponse extends BaseResponse {
  conceptosCancelacion: CancelConcepts[];
  totalRegistros: number;
}

export interface GetCancelConceptResponse extends BaseResponse {
  conceptoCancelacion: CancelConcepts;
}