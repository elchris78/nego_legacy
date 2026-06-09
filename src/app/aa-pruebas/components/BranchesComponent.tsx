"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  toggleBranchStatus,
  branches,
  isLoading,
  getError,
  deleteBranch,
} from "@/services/branches/branchesSlice";
import { RootState, AppDispatch } from "@/store";
import Cookies from "js-cookie";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const BranchesComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const branchList = useSelector((state: RootState) => state.branches.branches);
  const branchById = useSelector((state: RootState) => state.branches.branchById);

  const loading = useSelector((state: RootState) => state.branches.loading);
  const error = useSelector((state: RootState) => state.branches.error);
  const token = Cookies.get("auth-token") || "";

  const [newBranch, setNewBranch] = useState({
    name: "",
    postalCode: "",
    street: "",
    externalNumber: "",
    neighborhood: "",
    contactEmail: "",
    internalNumber: "",
    phone: "",
    responsible: "",
    businessHours: "",
  });

  const [branchId, setBranchId] = useState<number>(0);
  const [toggleStatus, setToggleStatus] = useState<boolean>(true);
  const [deleteBranchId, setDeleteBranchId] = useState<number>(0);

  const handleDeleteBranch = () => {
    if (deleteBranchId === 0) {
      alert("Por favor, ingrese un ID válido.");
      return;
    }
    dispatch(deleteBranch({ token, request: { branchId: deleteBranchId } }));
  };

  const handleFetchBranches = () => {
    dispatch(getBranches({ token }));
  };

  const handleFetchBranchById = () => {
    if (branchId === 0) {
      alert("Por favor, ingrese un ID válido.");
      return;
    }
    dispatch(getBranchById({ token, request: { branchId } }));
  };

  const handleCreateBranch = () => {
    dispatch(createBranch({ token, request: newBranch }));
  };

  const handleUpdateBranch = () => {
    dispatch(
      updateBranch({
        token,
        request: { ...newBranch, branchId, status: true },
      })
    );
  };

  const handleToggleBranchStatus = () => {
    dispatch(toggleBranchStatus({ token, request: { branchId, isActive: toggleStatus } }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "postalCode", headerName: "Código Postal", width: 150 },
    { field: "status", headerName: "Estado", width: 110 },
    { field: "creationDate", headerName: "Fecha de Creación", width: 180 },
  ];

  return (
    <div className="p-5 font-sans bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600">Gestión de Sucursales</h1>

      <button
        onClick={handleFetchBranches}
        disabled={loading}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Cargando..." : "Obtener Sucursales"}
      </button>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold"> Crear / Editar Sucursal </h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Código Postal"
            value={newBranch.postalCode}
            onChange={(e) => setNewBranch({ ...newBranch, postalCode: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Calle"
            value={newBranch.street}
            onChange={(e) => setNewBranch({ ...newBranch, street: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Número Externo"
            value={newBranch.externalNumber}
            onChange={(e) => setNewBranch({ ...newBranch, externalNumber: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Barrio"
            value={newBranch.neighborhood}
            onChange={(e) => setNewBranch({ ...newBranch, neighborhood: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Correo de Contacto"
            value={newBranch.contactEmail}
            onChange={(e) => setNewBranch({ ...newBranch, contactEmail: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Número Interno"
            value={newBranch.internalNumber}
            onChange={(e) => setNewBranch({ ...newBranch, internalNumber: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={newBranch.phone}
            onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Responsable"
            value={newBranch.responsible}
            onChange={(e) => setNewBranch({ ...newBranch, responsible: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Horario Comercial"
            value={newBranch.businessHours}
            onChange={(e) => setNewBranch({ ...newBranch, businessHours: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreateBranch}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear Sucursal
        </button>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Actualizar Sucursal</h3>
        <input
          type="number"
          placeholder="ID Sucursal"
          value={branchId}
          onChange={(e) => setBranchId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpdateBranch}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Actualizar Sucursal
        </button>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Cambiar Estado Sucursal</h3>
        <input
          type="number"
          placeholder="ID Sucursal"
          value={branchId}
          onChange={(e) => setBranchId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <select
          onChange={(e) => setToggleStatus(e.target.value === "true")}
          className="border p-2 rounded w-full mt-2"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <button
          onClick={handleToggleBranchStatus}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cambiar Estado
        </button>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Obtener Sucursal por ID</h3>
        <input
          type="number"
          placeholder="ID Sucursal"
          value={branchId}
          onChange={(e) => setBranchId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleFetchBranchById}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Obtener Sucursal
        </button>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Eliminar Sucursal</h3>
        <input
          type="number"
          placeholder="ID Sucursal"
          value={deleteBranchId}
          onChange={(e) => setDeleteBranchId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleDeleteBranch}
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar Sucursal
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      <h2 className="text-xl font-semibold mt-8">Lista de Sucursales</h2>
      <div className="mt-4 bg-white p-4 shadow rounded">
        <DataGrid
          rows={branchList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          style={{ height: 'auto' }}
          loading={loading}
        />
        {branchById ? (
          <div className="text-sm text-gray-500 mt-2 space-y-2">
            <p><strong>Branch ID:</strong> {branchById.branchId}</p>
            <p><strong>Name:</strong> {branchById.name}</p>
            <p><strong>Postal Code:</strong> {branchById.postalCode}</p>
            <p><strong>Street:</strong> {branchById.street}</p>
            <p><strong>External Number:</strong> {branchById.externalNumber}</p>
            <p><strong>Neighborhood:</strong> {branchById.neighborhood}</p>
            <p><strong>Contact Email:</strong> {branchById.contactEmail}</p>
            <p><strong>Internal Number:</strong> {branchById.internalNumber}</p>
            <p><strong>Phone:</strong> {branchById.phone}</p>
            <p><strong>Responsible:</strong> {branchById.responsible}</p>
            <p><strong>Business Hours:</strong> {branchById.businessHours}</p>
            <p><strong>Status:</strong> {branchById.status ? "Activa" : "Inactiva"}</p>
            <p><strong>Creation Date:</strong> {new Date(branchById.creationDate).toLocaleString()}</p>
            <p><strong>Message:</strong> {branchById.message}</p>
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-2">
            <p>No se ha realizado ninguna búsqueda de sucursal por ID.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchesComponent;
