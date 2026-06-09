"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import { validateClaims } from "@/lib/services/claims/useCases/validateClaims";
import Cookies from "js-cookie";
import DepartmentsComponent from "./components/DepartmentsComponent";
import BranchesComponent from "./components/BranchesComponent";
import UserActionsActivityComponent from "./components/UserActionsHistoryComponent";
import UserActivityComponent from "./components/UserActivityComponent";
import TemplatesComponent from "./components/TemplatesComponent";
import TemplatesCompanyComponent from "./components/TemplatesCompanyComponent";
import UsersComponent from "./components/UsersComponent";
import UsersCompanyComponent from "./components/UsersCompanyComponent";

type Section = "claims" | "departments" | "sucursales" | "binnacle" | "binnacle2" | "templates" | "templatesCompany" | "adminUsers" | "companyUsers";

const sections = [
  { key: "claims" as Section, label: "Claims" },
  { key: "departments" as Section, label: "Departamentos" },
  { key: "sucursales" as Section, label: "Sucursales" },
  { key: "binnacle" as Section, label: "Bitácora" },
  { key: "binnacle2" as Section, label: "Bitácora 2 )?" },
  { key: "templates" as Section, label: "Plantillas Admin" },
  { key: "templatesCompany" as Section, label: "Plantillas Empresa" },
  { key: "adminUsers" as Section, label: "Usuarios Admin"},
  { key: "companyUsers" as Section, label: "Usuarios Empresa"}
];

const buttonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: "10px 20px",
  marginRight: "10px",
  backgroundColor: isActive ? "#007BFF" : "#ccc",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
});

const ClaimsScreen: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("claims");
  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);
  const isLoading = useSelector((state: RootState) => state.claims.loading);
  const error = useSelector((state: RootState) => state.claims.error);

  const hasAdminAccess = validateClaims("Section", "Ventas.Crear");

  useEffect(() => {
    if (currentSection === "claims") {
      const token = Cookies.get("auth-token") || "";
      dispatch(fetchClaims(token));
    }
  }, [dispatch, currentSection]);

  const renderSection = () => {
    switch (currentSection) {
      case "claims":
        return (
          <div>
            <br />
            <h1>
              <strong>Claims:</strong>
            </h1>
            {isLoading && <p>Cargando claims...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!isLoading && !error && (
              <ul>
                {claims?.map((claim, index) => (
                  <li key={index}>
                    <strong>Tipo:</strong> {claim.claimType} <strong>Valor:</strong> {claim.claimValue} <br />
                  </li>
                ))}
              </ul>
            )}
            <div>
              <br />
              <h2>
                <strong>Validación de Claims</strong>
              </h2>
              {hasAdminAccess ? (
                <p>Hay claim</p>
              ) : (
                <p>No hay claim.</p>
              )}
              <br />
            </div>
          </div>
        );
      case "departments":
        return <DepartmentsComponent />;
      case "sucursales":
        return <BranchesComponent />;
      case "binnacle":
        return <UserActivityComponent />;
      case "binnacle2":
        return <UserActionsActivityComponent />;
      case "templates":
        return <TemplatesComponent />;
      case "templatesCompany":
        return <TemplatesCompanyComponent />;
      case "adminUsers":
        return <UsersComponent />;
      case "companyUsers":
        return <UsersCompanyComponent />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setCurrentSection(section.key)}
            style={buttonStyle(currentSection === section.key)}
          >
            {section.label}
          </button>
        ))}
      </div>
      {renderSection()}
    </div>
  );
};

export default ClaimsScreen;
