"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
  departments,
  isLoading,
  getError,
  deleteDepartment,
} from "@/services/departments/departmentsSlice";
import { RootState, AppDispatch } from "@/store";
import Cookies from "js-cookie";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const DepartmentsComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const departmentList = useSelector((state: RootState) => state.departments.departments);
  const loading = useSelector((state: RootState) => state.departments.loading);
  const error = useSelector((state: RootState) => state.departments.error);
  const token = Cookies.get("auth-token") || "";

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    area: "",
    description: "",
    responsible: "",
    isActive: "",
  });

  const [departmentId, setDepartmentId] = useState<any>(0);
  const [toggleStatus, setToggleStatus] = useState<boolean>(true);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string>("0");

  const handleDeleteDepartment = () => {
    if (deleteDepartmentId === "0") {
      alert("Por favor, ingrese un ID válido.");
      return;
    }
    dispatch(deleteDepartment({ token, request: { departmentId: deleteDepartmentId } }));
  };
  
  const handleFetchDepartments = () => {
    dispatch(getDepartments({ token }));
  };

  const handleFetchDepartmentById = () => {
    if (departmentId === 0) {
      alert("Por favor, ingrese un ID válido.");
      return;
    }
    dispatch(getDepartmentById({ token, request: { departmentId } }));
  };

  const handleCreateDepartment = () => {
    dispatch(createDepartment({ token, request: newDepartment }));
  };

  const handleUpdateDepartment = () => {
    dispatch(
      updateDepartment({
        token,
        request: { ...newDepartment, departmentId, status: true },
      })
    );
  };

  const handleToggleDepartmentStatus = () => {
    dispatch(toggleDepartmentStatus({ token, request: { departmentId, isActive: toggleStatus } }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "area", headerName: "Área", width: 150 },
    { field: "status", headerName: "Estado", width: 110 },
    { field: "creationDate", headerName: "Fecha de Creación", width: 180 },
  ];


  console.log('mensaje', error);
  return (
    <div className="p-5 font-sans bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600">Gestión de Departamentos</h1>

      <button
        onClick={handleFetchDepartments}
        disabled={loading}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Cargando..." : "Obtener Departamentos"}
      </button>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold"> Crear / Editar Departamento </h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Área"
            value={newDepartment.area}
            onChange={(e) => setNewDepartment({ ...newDepartment, area: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newDepartment.description}
            onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Responsable"
            value={newDepartment.responsible}
            onChange={(e) => setNewDepartment({ ...newDepartment, responsible: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreateDepartment}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear Departamento
        </button>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Actualizar Departamento</h3>
        <input
          type="number"
          placeholder="ID Departamento"
          value={departmentId}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpdateDepartment}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Actualizar Departamento
        </button>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Cambiar Estado Departamento</h3>
        <input
          type="number"
          placeholder="ID Departamento"
          value={departmentId}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
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
          onClick={handleToggleDepartmentStatus}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cambiar Estado
        </button>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Obtener Departamento por ID</h3>
        <input
          type="number"
          placeholder="ID Departamento"
          value={departmentId}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleFetchDepartmentById}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Obtener Departamento
        </button>
      </div>
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Eliminar Departamento</h3>
        <input
          type="number"
          placeholder="ID Departamento"
          value={deleteDepartmentId}
          onChange={(e) => setDeleteDepartmentId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleDeleteDepartment}
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar Departamento
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      <h2 className="text-xl font-semibold mt-8">Lista de Departamentos</h2>
      <div className="mt-4 bg-white p-4 shadow rounded">
        <DataGrid
          rows={departmentList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          style={{ height: 'auto' }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DepartmentsComponent;
