// CompaniesForm.tsx
import { CompanyWithClaimsRequest } from "@/app/admin/usuarios/services/adminUsersTypes";
import React, { useState } from "react";

export interface ClaimInput {
  claimType: string;
  claimValue: string;
}

interface CompaniesFormProps {
  companies: CompanyWithClaimsRequest[];
  setCompanies: (companies: CompanyWithClaimsRequest[]) => void;
}

const CompaniesForm: React.FC<CompaniesFormProps> = ({ companies, setCompanies }) => {
  // Para el ID de la compañía, usamos string
  const [companyId, setCompanyId] = useState("");
  const [roleTemplateId, setRoleTemplateId] = useState("");
  // Estados para ingresar un claim
  const [claimType, setClaimType] = useState("");
  const [claimValue, setClaimValue] = useState("");
  // Estado temporal para almacenar los claims de la nueva compañía
  const [tempClaims, setTempClaims] = useState<ClaimInput[]>([]);

  const handleAddClaim = () => {
    if (claimType.trim() === "" || claimValue.trim() === "") {
      alert("Ingrese Claim Type y Claim Value válidos");
      return;
    }
    setTempClaims([...tempClaims, { claimType, claimValue }]);
    setClaimType("");
    setClaimValue("");
  };

  const handleAddCompany = () => {
    if (companyId.trim() === "" || roleTemplateId.trim() === "") {
      alert("Ingrese el ID de la compañía y Role Template ID");
      return;
    }
    const newCompany: CompanyWithClaimsRequest = {
      id: Number(companyId.trim()),
      roleTemplateId: roleTemplateId.trim(),
      individualClaims: tempClaims,
    };
    setCompanies([...companies, newCompany]);
    // Reiniciar estados
    setCompanyId("");
    setRoleTemplateId("");
    setTempClaims([]);
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="text-lg font-semibold">Agregar Compañía</h3>
      <div className="flex flex-col gap-2">
        <div>
          <label className="block text-sm font-medium">ID de Compañía</label>
          <input
            type="text"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role Template ID</label>
          <input
            type="text"
            value={roleTemplateId}
            onChange={(e) => setRoleTemplateId(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="border p-2 rounded">
          <h4 className="text-sm font-semibold">Claims</h4>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Claim Type"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Claim Value"
              value={claimValue}
              onChange={(e) => setClaimValue(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={handleAddClaim}
              className="bg-purple-500 text-white px-2 rounded"
            >
              Agregar
            </button>
          </div>
          {tempClaims.length > 0 && (
            <ul className="mt-2 ml-4 text-sm">
              {tempClaims.map((claim, index) => (
                <li key={index}>
                  {claim.claimType}: {claim.claimValue}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleAddCompany}
          className="bg-green-500 text-white p-2 rounded mt-2"
        >
          Agregar Compañía
        </button>
      </div>

      {companies.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Compañías Agregadas:</h4>
          <ul className="ml-4 text-sm">
            {companies.map((comp, index) => (
              <li key={index}>
                ID: {comp.id}, RoleTemplateID: {comp.roleTemplateId}, Claims:{" "}
                {comp.individualClaims.map((c) => `${c.claimType}: ${c.claimValue}`).join(" | ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompaniesForm;
