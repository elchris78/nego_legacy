export interface Categories {
    id: string;
    uid: string;
    claveCategoria: string
    nombre: string
    estatus: boolean
    userProvidedId: any
    subcategorias: Categories[]
    parentCategoriaNombre?: string
    hasSubcategories?: boolean
}

export interface CategoriesParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    isActive?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateCategoriesResponse extends BaseResponse { 
  categoriaId: string;
}

export interface UpdateCategoriesResponse extends BaseResponse {
    categoriaId: string;
  }
  
  export interface DeleteCategoriesResponse extends BaseResponse {
    categoriasId: string;
  }
  
  export interface GetCategoriesResponse extends BaseResponse {
    categorias: Categories[];
    totalRegistros: number;
  }
  
  export interface GetCategorieResponse extends BaseResponse {
    categoria: Categories;
  }