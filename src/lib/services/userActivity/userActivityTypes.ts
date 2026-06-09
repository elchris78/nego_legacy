// Base Response Interface
export interface BaseResponse {
  success: boolean;
  message: string;
}

// GET - Historial de Actividad de Usuario (Paginado)
export interface GetActivityHistoryRequest {
  startDate?: string;
  endDate?: string;
  logoutReason?: string;
  Paginas?: number; // Renombrado
  Size?: number;
  searchQuery?: string;
  connectionStatuses?: string[];

  // login
  loginStartDate?: string;
  loginEndDate?: string;
  loginStartTime?: string;
  loginEndTime?: string;

  // logout
  logoutStartDate?: string;
  logoutEndDate?: string;
  logoutStartTime?: string;
  logoutEndTime?: string;

  // active time
  activePeriodStart?: string;
  activePeriodEnd?: string;
  minActiveHours?: string;

  // inactive time
  inactivePeriodStart?: string;
  inactivePeriodEnd?: string;
  minInactiveHours?: string;
}

export interface GetActivityCompanyHistoryRequest {
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  actionTypes?: string[];
  modules?: string[];
  subModules?: string[];
  Paginas?: number; // Renombrado
  Size?: number;
  startTime?: string;
  endTime?: string;
}

export interface UserActivityHistoryDto {
  userId:             string;
  fullName:           string;
  email:              string;
  userName:           string;
  connectionStatus:   string;
  date:               string;
  firstCheckIn:       string;
  checkIn:            string;
  lastCheckIn:        string;
  checkOut:           string;
  lastCheckOut:       string;
  lastCheckOutReason: string;
  inactivityTime:     number;
  activeTime:         number;
  companyId:          number;
}

export interface GetUserActivityHistoryResponse extends BaseResponse {
  totalRegistros: number;
  userActivityHistoryDatas: UserActivityHistoryDto[];
}

export interface ActionsActivityHistoryDto {
  activityId:   number;
  userId:       string;
  fullName:     string;
  userName:     string;
  email:        string;
  idDocumento:  string;
  nombreEquipo: string;
  date:         string;
  activity:     string;
  description:  string;
  folio:        string;
  module:       string;
  subModule:    string;
  deviceType:   string;
  ipAddress:    string;
  companyId:    string | null;
}

export interface GetActionsHistoryResponse extends BaseResponse {
  totalRegistros: number;
  userActionsHistory: ActionsActivityHistoryDto[];
}
