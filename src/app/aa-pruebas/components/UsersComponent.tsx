"use client";

import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { RootState, AppDispatch } from "@/store";

// Importa los async thunks y selectores del slice de usuarios
import {
  getUsers,
  getUserById,
  createNewUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  createUserNoClaims,
  assignClaims,
  user,
  users,
  isLoading,
  getError,
} from "../../admin/usuarios/services/usersSlice";

// Importa el formulario para Companies con claims
import CompaniesForm from "./Forms/CompaniesForm";
import { CompanyWithClaimsRequest } from "@/app/admin/usuarios/services/adminUsersTypes";

const UsersComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.users.user);
  const usersList = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);
  const token = Cookies.get("auth-token") || "";

  useEffect(() => {
    // Limpia el estado de usuarios al montar el componente
    console.log("UsersComponent mounted and is loading", loading);
  }, [loading]);
  // Estado para filtros en fetchUsers (usando los campos requeridos)
  const [searchParams, setSearchParams] = useState({
    searchQuery: "",
    status: undefined as boolean | undefined,
    roleTemplateId: "",
    page: 1,
    size: 10,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  // Estados para payloads de creación y actualización (para usuario con claims)
  const [createPayload, setCreatePayload] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isActive: true,
    typeOfUser: "",
  });
  const [updatePayload, setUpdatePayload] = useState({
    id: "",
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isActive: true,
    typeOfUser: "",
  });

  // Estado para almacenar las compañías (para usuario con claims)
  const [companies, setCompanies] = useState<CompanyWithClaimsRequest[]>([]);

  // Estado para asignar claims (usando CompaniesForm)
  const [assignPayload, setAssignPayload] = useState({
    userId: 0,
    companies: [] as CompanyWithClaimsRequest[],
  });

  // Estado para crear usuario sin claims
  const [createNoClaimsPayload, setCreateNoClaimsPayload] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isActive: true,
    typeOfUser: "",
  });
  // Para compañías sin claims: se ingresan IDs separados por coma
  const [companiesNoClaimsInput, setCompaniesNoClaimsInput] = useState("");

  // Campo para operaciones basadas en ID (get, toggle, delete)
  const [userId, setUserId] = useState("");

  // Handlers de endpoints
  // const handleFetchUsers = () => {
  //  console.log("searchParams", searchParams);
  //   dispatch(getUsers({ token, params: searchParams }));
  // };

  const handleGetUserById = () => {
    if (!userId) {
      alert("Ingrese un User ID válido");
      return;
    }
    dispatch(getUserById({ token, id: userId }));
  };

  const handleCreateUser = () => {
    dispatch(
      createNewUser({ token, body: { ...createPayload, companies } })
    );
  };

  const handleUpdateUser = () => {
    if (!updatePayload.id) {
      alert("Ingrese un User ID para actualizar");
      return;
    }
    dispatch(
      updateUser({ token, body: { ...updatePayload, companies } })
    );
  };

  const handleToggleUserStatus = () => {
    if (!userId) {
      alert("Ingrese un User ID");
      return;
    }
    dispatch(toggleUserStatus({ token, userId }));
  };

  const handleDeleteUser = () => {
    if (!userId) {
      alert("Ingrese un User ID para eliminar");
      return;
    }
    dispatch(deleteUser({ token, userId }));
  };

  const handleCreateUserNoClaims = () => {
    // Convertir la cadena a un array de objetos { id: number }
    const companiesParsed = companiesNoClaimsInput
      .split(",")
      .map((s) => ({ id: Number(s.trim()) }))
      .filter((comp) => comp.id);
    if (companiesParsed.length === 0) {
      alert("Ingrese al menos un ID de compañía");
      return;
    }
    dispatch(
      createUserNoClaims({
        token,
        body: { 
          ...createNoClaimsPayload, 
          companies: companiesParsed.map(company => ({
            id: company.id,
            roleTemplateId: "", // Provide a default or actual value
            individualClaims: [] // Provide a default or actual value
          }))
        },
      })
    );
  };

  const handleAssignClaims = () => {
    dispatch(
      assignClaims({
        token,
        body: { userId: assignPayload.userId.toString(), companies: assignPayload.companies },
      })
    );
  };

  // Definición de columnas para el DataGrid (Users List)
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "typeOfUser", headerName: "User Type", width: 150 },
    { field: "isActive", headerName: "Active", width: 100, type: "boolean" },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  return (
    <div className="p-5 font-sans bg-gray-50 relative">
      {/* Backdrop de carga */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <h1 className="text-2xl font-bold text-blue-600">Prueba Endpoints AdminUsers</h1>
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Sección: Fetch Users */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Fetch Users</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium">
            Página actual
          </label>
          <input
            type="number"
            placeholder="Página"
            value={searchParams.page}
            onChange={(e) =>
              setSearchParams({ ...searchParams, page: Number(e.target.value) })
            }
            className="border p-2 rounded mt-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Tamaño de página</label>
          <input
            type="number"
            placeholder="Tamaño"
            value={searchParams.size}
            onChange={(e) =>
              setSearchParams({ ...searchParams, size: Number(e.target.value) })
            }
            className="border p-2 rounded mt-1"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Estado (status)</label>
          <select
            value={
              searchParams.status === undefined
                ? ""
                : searchParams.status
                ? "true"
                : "false"
            }
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                status:
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "true"
                    ? true
                    : false,
              })
            }
            className="border p-2 rounded mt-1"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Role Template ID</label>
          <input
            type="text"
            placeholder="Role Template ID"
            value={searchParams.roleTemplateId}
            onChange={(e) =>
              setSearchParams({ ...searchParams, roleTemplateId: e.target.value })
            }
            className="border p-2 rounded mt-1"
          />
        </div>
        <input
          type="text"
          placeholder="Search Query"
          value={searchParams.searchQuery}
          onChange={(e) =>
            setSearchParams({ ...searchParams, searchQuery: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="date"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              startDate: e.target.value ? new Date(e.target.value) : undefined,
            })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="date"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              endDate: e.target.value ? new Date(e.target.value) : undefined,
            })
          }
          className="border p-2 rounded mr-2"
        />
        {/* <button onClick={handleFetchUsers} className="bg-blue-500 text-white p-2 rounded">
          Fetch Users
        </button> */}
      </div>


      {/* Sección: Create User (con Claims) */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Create User (Con Claims)</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={createPayload.fullName}
          onChange={(e) =>
            setCreatePayload({ ...createPayload, fullName: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="User Name"
          value={createPayload.userName}
          onChange={(e) =>
            setCreatePayload({ ...createPayload, userName: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={createPayload.email}
          onChange={(e) =>
            setCreatePayload({ ...createPayload, email: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={createPayload.password}
          onChange={(e) =>
            setCreatePayload({ ...createPayload, password: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={createPayload.confirmPassword}
          onChange={(e) =>
            setCreatePayload({ ...createPayload, confirmPassword: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Type of User"
          value={createPayload.typeOfUser}
          onChange={(e) =>
            setCreatePayload({ ...createPayload, typeOfUser: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={createPayload.isActive}
            onChange={(e) =>
              setCreatePayload({ ...createPayload, isActive: e.target.checked })
            }
            className="mr-2"
          />
          <label className="text-sm font-medium">Active</label>
        </div>
        {/* Formulario para Companies con Claims */}
        <CompaniesForm companies={companies} setCompanies={setCompanies} />
        <button onClick={handleCreateUser} className="bg-green-500 text-white p-2 rounded">
          Create User
        </button>
      </div>

      {/* Sección: Create User No Claims */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Create User No Claims</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={createNoClaimsPayload.fullName}
          onChange={(e) =>
            setCreateNoClaimsPayload({ ...createNoClaimsPayload, fullName: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="User Name"
          value={createNoClaimsPayload.userName}
          onChange={(e) =>
            setCreateNoClaimsPayload({ ...createNoClaimsPayload, userName: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={createNoClaimsPayload.email}
          onChange={(e) =>
            setCreateNoClaimsPayload({ ...createNoClaimsPayload, email: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={createNoClaimsPayload.password}
          onChange={(e) =>
            setCreateNoClaimsPayload({ ...createNoClaimsPayload, password: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={createNoClaimsPayload.confirmPassword}
          onChange={(e) =>
            setCreateNoClaimsPayload({ ...createNoClaimsPayload, confirmPassword: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={createNoClaimsPayload.isActive}
            onChange={(e) =>
              setCreateNoClaimsPayload({ ...createNoClaimsPayload, isActive: e.target.checked })
            }
            className="mr-2"
          />
          <label className="text-sm font-medium">Active</label>
        </div>
        <input
          type="text"
          placeholder="Type of User"
          value={createNoClaimsPayload.typeOfUser}
          onChange={(e) =>
            setCreateNoClaimsPayload({ ...createNoClaimsPayload, typeOfUser: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <div className="mb-2">
          <label className="block text-sm font-medium">
            Companies (ingresa IDs separados por coma)
          </label>
          <input
            type="text"
            placeholder="Ej: 1,2,3"
            value={companiesNoClaimsInput}
            onChange={(e) => setCompaniesNoClaimsInput(e.target.value)}
            className="border p-2 rounded mt-1"
          />
        </div>
        <button onClick={handleCreateUserNoClaims} className="bg-green-500 text-white p-2 rounded">
          Create User No Claims
        </button>
      </div>

      {/* Sección: Update User */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Update User</h2>
        <input
          type="text"
          placeholder="User ID"
          value={updatePayload.id}
          onChange={(e) => setUpdatePayload({ ...updatePayload, id: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={updatePayload.fullName}
          onChange={(e) => setUpdatePayload({ ...updatePayload, fullName: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="User Name"
          value={updatePayload.userName}
          onChange={(e) => setUpdatePayload({ ...updatePayload, userName: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={updatePayload.email}
          onChange={(e) => setUpdatePayload({ ...updatePayload, email: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={updatePayload.password}
          onChange={(e) => setUpdatePayload({ ...updatePayload, password: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={updatePayload.confirmPassword}
          onChange={(e) =>
            setUpdatePayload({ ...updatePayload, confirmPassword: e.target.value })
          }
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Type of User"
          value={updatePayload.typeOfUser}
          onChange={(e) => setUpdatePayload({ ...updatePayload, typeOfUser: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        {/* Reutilizamos CompaniesForm para Update */}
        <CompaniesForm companies={companies} setCompanies={setCompanies} />
        <button onClick={handleUpdateUser} className="bg-green-500 text-white p-2 rounded">
          Update User
        </button>
      </div>

      {/* Sección: Get User by ID */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Get User by ID</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleGetUserById} className="bg-blue-500 text-white p-2 rounded">
          Get User by ID
        </button>
      </div>

      {/* Sección: Toggle User Status */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Toggle User Status</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleToggleUserStatus} className="bg-blue-500 text-white p-2 rounded">
          Toggle Status
        </button>
      </div>

      {/* Sección: Delete User */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Delete User</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleDeleteUser} className="bg-red-500 text-white p-2 rounded">
          Delete User
        </button>
      </div>

      {/* Sección: Assign Claims */}
      <div className="mt-4 border p-4 rounded">
        <h2 className="text-lg font-semibold">Assign Claims</h2>
        <input
          type="number"
          placeholder="User ID"
          value={assignPayload.userId}
          onChange={(e) =>
            setAssignPayload({ ...assignPayload, userId: Number(e.target.value) })
          }
          className="border p-2 rounded mr-2"
        />
        <CompaniesForm
          companies={assignPayload.companies}
          setCompanies={(c) =>
            setAssignPayload({ ...assignPayload, companies: c })
          }
        />
        <button onClick={handleAssignClaims} className="bg-purple-500 text-white p-2 rounded">
          Assign Claims
        </button>
      </div>

      {/* Sección: Mostrar Users List en tabla */}
      <div className="mt-6 border p-4 rounded">
        <h2 className="text-lg font-semibold">Users List</h2>
        <DataGrid
          rows={usersList || []}
          columns={columns}
          getRowId={(row) => row.id}
          paginationModel={{ pageSize: searchParams.size, page: searchParams.page - 1 }}
          pageSizeOptions={[searchParams.size]}
          pagination
          style={{ height: 400 }}
          loading={loading}
        />
      </div>

      {/* Sección: Mostrar Current User */}
      <div className="mt-6 border p-4 rounded">
        <h2 className="text-lg font-semibold">Current User</h2>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
      </div>
    </div>
  );
};

export default UsersComponent;
