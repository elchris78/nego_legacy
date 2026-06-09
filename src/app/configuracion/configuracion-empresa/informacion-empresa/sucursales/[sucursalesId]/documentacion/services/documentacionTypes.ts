export interface DocumentacionParams {
  searchQuery?: string;
  size?: number;
  page?: number;
  isActive?: string[];
}

export interface DocumentacionValue {
  uid?: string;
  id: string;
  formato: string;
  nombre: string;
  fechaSubida: string;
  fechaModificacion: string;
  creadoPor: string;
  isDeleted: boolean;
}