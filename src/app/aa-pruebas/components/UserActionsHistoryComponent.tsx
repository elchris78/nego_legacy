"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchActionActivityHistory
} from "@/services/userActivity/userActivitySlice";
import { RootState, AppDispatch } from "@/store";
import Cookies from "js-cookie";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const CompanyActivityComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const userActivityHistory = useSelector(
    (state: RootState) => state.userActivity.actionsActivityHistory
  );
  const totalRecords = useSelector(
    (state: RootState) => state.userActivity.actionsTotalRecords
  );
  console.log("userActivityHistory", userActivityHistory);
  console.log("totalRecords", totalRecords);
  const loading = useSelector((state: RootState) => state.userActivity.loading);
  const error = useSelector((state: RootState) => state.userActivity.error);
  const token = Cookies.get("auth-token") || "";

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  const handleFetchUserActivity = () => {
    dispatch(
      fetchActionActivityHistory(token, {
        // pageNumber: Paginas || undefined,
        // pageSize: Size || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
    );
  };
  /* 
  export interface ActionsActivityHistoryDto {
  activityId: number;
  userId: string;
  date: string;
  activity: string;
  description: string;
  folio: string;
  module: string;
  subModule: string;
  companyId: number;
}
  */

  const columns: GridColDef[] = [
    { field: "activityId", headerName: "ID de Actividad", width: 150 },
    { field: "userId", headerName: "ID de Usuario", width: 150 },
    { field: "date", headerName: "Fecha", width: 180 },
    { field: "activity", headerName: "Actividad", width: 180 },
    { field: "description", headerName: "Descripción", width: 180 },
    { field: "folio", headerName: "Folio", width: 180 },
    { field: "module", headerName: "Módulo", width: 180 },
    { field: "subModule", headerName: "Submódulo", width: 180 },
    { field: "companyId", headerName: "ID de Compañía", width: 180 },
  ];

  return (
    <div className="p-5 font-sans bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600">Historial de Actividad de Usuarios</h1>
      <button
        onClick={handleFetchUserActivity}
        disabled={loading}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Cargando..." : "Obtener Historial"}
      </button>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      <h2 className="text-xl font-semibold mt-8">Lista de Actividades</h2>
      <div className="flex space-x-4 mt-4">
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="Fecha Inicio"
        />
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="Fecha Fin"
        />
      </div>
      <div className="mt-4 bg-white p-4 shadow rounded">
      <DataGrid
        rows={userActivityHistory}
        columns={columns}
        rowCount={totalRecords} // Total de registros
        hideFooter // Ocultar el pie de página
        style={{ height: 400, width: "100%" }}
        loading={loading}
        getRowId={(row) => row.userId}
      />

        <div className="mt-4 flex space-x-4 items-center">
          Número de página:
          <input
            type="number"
            min="1"
            value={pageNumber}
            onChange={(e) => setPageNumber(Number(e.target.value))}
            className="border p-2 rounded w-32 ml-2 mr-6"
            placeholder="Número de Página"
          />
          Número de filas por página:
          <input
            type="number"
            min="1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border p-2 rounded w-32"
            placeholder="Tamaño de Página"
          />
                    Número de filas por página:
          <div
            className="border p-2 rounded w-32"
          >
            {totalRecords}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyActivityComponent;
