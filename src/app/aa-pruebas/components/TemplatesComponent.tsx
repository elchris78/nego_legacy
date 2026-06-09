"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTemplates,
  getTemplatesByCompany,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateStatus,
} from "../../admin/plantillas/services/plantillasSlice";
import { RootState, AppDispatch } from "@/store";
import Cookies from "js-cookie";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ClaimDto } from "@/app/admin/plantillas/services/plantillasTypes";

const RoleTemplatesComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const roleTemplatesList = useSelector((state: RootState) => state.plantillas.roleTemplates);
  const totalRecordsInTemplatesList = useSelector((state: RootState) => state.plantillas.totalRecordsTemplates)
  const roleTemplatesByCompanyList = useSelector((state: RootState) => state.plantillas.roleTemplatesByCompany);
  const roleTemplateByIdData = useSelector((state: RootState) => state.plantillas.roleTemplateById);
  const loading = useSelector((state: RootState) => state.plantillas.loading);
  const error = useSelector((state: RootState) => state.plantillas.error);
  const token = Cookies.get("auth-token") || "";

  // Estado para filtros opcionales en getTemplates
  const [searchParams, setSearchParams] = useState({
    searchQuery: "",
    page: 0,
    size: 10,
    active: undefined as boolean | undefined,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  // Estado para manejar la creación/edición de role templates
  const [newTemplate, setNewTemplate] = useState({
    roleTemplateName: "",
    description: "",
    active: true,
    claims: [] as ClaimDto[],
    companyIds: [] as string[],
  });

  // Estados para inputs adicionales: manejo de claims y companyIds
  const [claimInput, setClaimInput] = useState({ claimType: "", claimValue: "" });
  const [companyIdsInput, setCompanyIdsInput] = useState("");

  const [templateId, setTemplateId] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [deleteTemplateId, setDeleteTemplateId] = useState<string>("");

  // Handlers para claims
  const handleAddClaim = () => {
    if (claimInput.claimType.trim() === "" || claimInput.claimValue.trim() === "") {
      alert("Ingrese un Claim Type y Claim Value válidos");
      return;
    }
    setNewTemplate((prev) => ({
      ...prev,
      claims: [...prev.claims, { claimType: claimInput.claimType, claimValue: claimInput.claimValue }],
    }));
    setClaimInput({ claimType: "", claimValue: "" });
  };

  // Handler para companyIds: se ingresa una cadena separada por comas
  const handleSetCompanyIds = () => {
    const ids = companyIdsInput.split(",").map((s) => s.trim()).filter(Boolean);
    setNewTemplate((prev) => ({
      ...prev,
      companyIds: ids,
    }));
  };

  // Handlers para los endpoints
  // const handleFetchTemplates = () => {
  //   dispatch(getTemplates({ token, params: searchParams }));
  // };

  const handleFetchTemplatesByCompany = () => {
    if (!companyId) {
      alert("Ingrese un Company ID válido");
      return;
    }
    dispatch(getTemplatesByCompany({ token, companyId }));
  };

  const handleFetchTemplateById = () => {
    if (!templateId) {
      alert("Ingrese un Template ID válido");
      return;
    }
    dispatch(getTemplateById({ token, id: templateId }));
  };

  const handleCreateTemplate = () => {
    dispatch(createTemplate({ token, body: newTemplate }));
  };

  const handleUpdateTemplate = () => {
    if (!templateId) {
      alert("Ingrese un Template ID para actualizar");
      return;
    }
    dispatch(updateTemplate({ token, id: templateId, body: newTemplate }));
  };

  const handleDeleteTemplate = () => {
    if (!deleteTemplateId) {
      alert("Ingrese un Template ID para eliminar");
      return;
    }
    dispatch(deleteTemplate({ token, id: deleteTemplateId }));
  };

  const handleToggleTemplateStatus = () => {
    if (!templateId) {
      alert("Ingrese un Template ID");
      return;
    }
    dispatch(toggleTemplateStatus({ token, id: templateId }));
  };

  // Definición de columnas para la DataGrid general
  const columns: GridColDef[] = [
    { field: "roleTemplateId", headerName: "ID", width: 150 },
    { field: "roleTemplateName", headerName: "Nombre", width: 200 },
    { field: "description", headerName: "Descripción", width: 250 },
    { field: "active", headerName: "Activo", width: 100 },
    { field: "defaultRole", headerName: "Default", width: 100 },
    { field: "createdAt", headerName: "Creado", width: 200 },
    {
      field: "companyIds",
      headerName: "Company IDs",
      width: 150,
      renderCell: (params) =>
        Array.isArray(params.value) ? params.value.join(", ") : "",
    },
    {
      field: "claims",
      headerName: "Claims",
      width: 300,
      renderCell: (params) =>
        Array.isArray(params.value) ? (
          <ul style={{ paddingLeft: "1rem", margin: 0 }}>
            {params.value.map((claim: any, index: number) => (
              <li key={index} style={{ listStyleType: "disc" }}>
                {claim.claimType}: {claim.claimValue}
              </li>
            ))}
          </ul>
        ) : (
          ""
        ),
    },
  ];

  // Columnas para roles (por compañía)
  const columnsRoleResponse: GridColDef[] = [
    { field: "roleTemplateId", headerName: "ID", width: 150 },
    { field: "roleTemplateName", headerName: "Nombre", width: 200 },
    { field: "description", headerName: "Descripción", width: 250 },
    { field: "active", headerName: "Activo", width: 100 },
    { field: "defaultRole", headerName: "Default", width: 100 },
    { field: "createdAt", headerName: "Creado", width: 200 },
  ];

  return (
    <div className="p-5 font-sans bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600">Gestión de Role Templates ADMIN</h1>

      {/* Backdrop de carga */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Sección: Buscar Role Templates */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Buscar Role Templates</h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchParams.searchQuery}
          onChange={(e) => setSearchParams({ ...searchParams, searchQuery: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <div className="mb-2">
          <label className="block text-sm font-medium">
            Página actual (Si es 0, trae todos los registros)
          </label>
          <input
            type="number"
            placeholder="Página"
            value={searchParams.page}
            onChange={(e) => setSearchParams({ ...searchParams, page: Number(e.target.value) })}
            className="border p-2 rounded mt-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">
            Número de páginas
          </label>
          <input
            type="number"
            placeholder="Tamaño"
            value={searchParams.size}
            onChange={(e) => setSearchParams({ ...searchParams, size: Number(e.target.value) })}
            className="border p-2 rounded mt-1"
          />
        </div>
        {/* Filtros de fecha con labels */}
        <div className="inline-flex items-center mr-2">
          <label className="mr-1 text-sm">Fecha de inicio:</label>
          <input
            type="date"
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                startDate: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            className="border p-2 rounded"
          />
        </div>
        <div className="inline-flex items-center mr-2">
          <label className="mr-1 text-sm">Fecha de fin:</label>
          <input
            type="date"
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                endDate: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            className="border p-2 rounded"
          />
        </div>
        {/* <button
          onClick={handleFetchTemplates}
          disabled={loading}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {loading ? "Cargando..." : "Buscar"}
        </button> */}
      </div>

      {/* Sección: Obtener templates por compañía */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Obtener Role Templates por Compañía</h3>
        <input
          type="text"
          placeholder="Company ID"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleFetchTemplatesByCompany}
          disabled={loading}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Obtener por Compañía
        </button>
      </div>

      {/* Sección: Obtener template por ID */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Obtener Role Template por ID</h3>
        <input
          type="text"
          placeholder="Template ID"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleFetchTemplateById}
          disabled={loading}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Obtener Template
        </button>
      </div>

      {/* Sección: Crear / Actualizar Role Template */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Crear / Actualizar Role Template</h3>
        <input
          type="text"
          placeholder="Template ID (Solo necesario en actualización)"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Nombre del Template"
          value={newTemplate.roleTemplateName}
          onChange={(e) => setNewTemplate({ ...newTemplate, roleTemplateName: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newTemplate.description}
          onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <div className="flex items-center mb-2">
          <label className="mr-2">Activo:</label>
          <input
            type="checkbox"
            checked={newTemplate.active}
            onChange={(e) => setNewTemplate({ ...newTemplate, active: e.target.checked })}
          />
        </div>
        {/* Inputs para Claims */}
        <div className="mb-2">
          <h4 className="font-semibold">Agregar Claim</h4>
          <input
            type="text"
            placeholder="Claim Type"
            value={claimInput.claimType}
            onChange={(e) => setClaimInput({ ...claimInput, claimType: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <input
            type="text"
            placeholder="Claim Value"
            value={claimInput.claimValue}
            onChange={(e) => setClaimInput({ ...claimInput, claimValue: e.target.value })}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={handleAddClaim}
            className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Agregar Claim
          </button>
          {newTemplate.claims.length > 0 && (
            <ul className="mt-2 text-sm">
              {newTemplate.claims.map((claim, index) => (
                <li key={index}>
                  {claim.claimType}: {claim.claimValue}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Input para Company IDs */}
        <div className="mb-2">
          <h4 className="font-semibold">Company IDs (separados por coma)</h4>
          <input
            type="text"
            placeholder="Ej: 1,2,3"
            value={companyIdsInput}
            onChange={(e) => setCompanyIdsInput(e.target.value)}
            className="border p-2 rounded w-[30%] mr-2"
          />
          <button
            onClick={handleSetCompanyIds}
            className="mt-2 p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Establecer Company IDs
          </button>
        </div>
        <button
          onClick={handleCreateTemplate}
          disabled={loading}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear Template
        </button>
        <button
          onClick={handleUpdateTemplate}
          disabled={loading}
          className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
        >
          Actualizar Template
        </button>
      </div>

      {/* Sección: Eliminar template */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Eliminar Role Template</h3>
        <input
          type="text"
          placeholder="Template ID a eliminar"
          value={deleteTemplateId}
          onChange={(e) => setDeleteTemplateId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleDeleteTemplate}
          disabled={loading}
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar Template
        </button>
      </div>

      {/* Sección: Cambiar estado del template */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Cambiar Estado del Role Template</h3>
        <input
          type="text"
          placeholder="Template ID"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleToggleTemplateStatus}
          disabled={loading}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cambiar Estado
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      <h2 className="text-xl font-semibold mt-8">Listado de Role Templates</h2>
      <span>Registros totales: {totalRecordsInTemplatesList}</span>
      <div className="mt-4 bg-white p-4 shadow rounded">
        <DataGrid
          rows={roleTemplatesList}
          columns={columns}
          getRowId={(row) => row.roleTemplateId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          style={{ height: "auto" }}
          loading={loading}
        />
      </div>
      
      <h2 className="text-xl font-semibold mt-8">Listado de Role Templates por Compañía</h2>
      <div className="mt-4 bg-white p-4 shadow rounded">
        <DataGrid
          rows={roleTemplatesByCompanyList}
          columns={columnsRoleResponse}
          getRowId={(row) => row.roleTemplateId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          style={{ height: "auto" }}
          loading={loading}
        />
      </div>

      {roleTemplateByIdData && (
        <div className="mt-8 bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold">Role Template por ID</h2>
          <div key={roleTemplateByIdData.roleTemplateId} className="border-b py-2">
            <p>
              <strong>ID:</strong> {roleTemplateByIdData.roleTemplateId}
            </p>
            <p>
              <strong>Nombre:</strong> {roleTemplateByIdData.roleTemplateName}
            </p>
            <p>
              <strong>Descripción:</strong> {roleTemplateByIdData.description}
            </p>
            <p>
              <strong>Activo:</strong> {roleTemplateByIdData.active ? "Sí" : "No"}
            </p>
            <p>
              <strong>Default:</strong> {roleTemplateByIdData.defaultRole ? "Sí" : "No"}
            </p>
            <p>
              <strong>Creado:</strong> {new Date(roleTemplateByIdData.createdAt).toLocaleString()}
            </p>
            <p>
              {/* <strong>Company IDs:</strong> {roleTemplateByIdData.companyIds.join(", ")} */}
            </p>
            <div>
              <strong>Claims:</strong>
              <ul className="ml-4">
                {roleTemplateByIdData.claims.map((claim, index) => (
                  <li key={index}>
                    {claim.claimType}: {claim.claimValue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleTemplatesComponent;
