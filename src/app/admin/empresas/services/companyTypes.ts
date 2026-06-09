export interface Company {
  id: number;
  name: string;
  address?: string;
}

export interface CompanyProps {
  companyId: number;
  name: string;
  token?: string;
}

export interface DeleteCompanyProps {
  companyId: number;
  token: string;
}

export interface FetchCompaniesProps {
  token?: string;
}
