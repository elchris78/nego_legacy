"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Empresas from "@/assets/Empresas.png";
import Cookies from "js-cookie";
import Image from "next/image";
import { selectCompany } from "./services/companyActions";
import Loading from '@/components/ui/Modals/loading';
import { ToastErrorMsg } from '@/Toast/ToastErrorMsg';
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import carruselIzq from '@/assets/carruselIzq.png';
import carruselDer from '@/assets/carrsuelDer.png';
import { Tooltip } from "@mui/material";

export interface Company {
  companyId: number;
  companyName: string;
}

const SelectedCompany: React.FC = () => {
  const [selectedCompanyId, setSelectedCompany] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const token = Cookies.get("auth-token") || "";
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/companies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las empresas");
        }

        const data: Company[] = await response.json();
        setCompanies(data);
      } catch (error) {
        setMessage("Error al obtener las empresas. Intente nuevamente.");
      }
    };

    fetchCompanies();
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 780) {
        setItemsPerPage(1);
      } else if (width < 1130) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage;
    return companies.slice(start, start + itemsPerPage);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < companies.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCompanySelect = async (companyId: number) => {
    setIsLoading(true);
    try {
      await selectCompany(companyId, setSelectedCompany, setMessage, router);
      setSelectedCompany(companyId);
    } catch {
      setMessage("Error al seleccionar la empresa");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && selectedCompanyId) {
      dispatch(fetchClaims(token));
    }
  }, [selectedCompanyId]);

  return (
    <div className="bg-white min-h-[calc(100vh-header-height)] flex mt-0 md:mt-12">
      {isLoading && <Loading />}

      <div className="flex flex-col items-center justify-center p-4 w-full">
        <h1 className="text-5xl text-center text-[#5B6670] font-bold">
          Bienvenido a Nego Web
        </h1>
        <p className="text-[#5D6D7E] mt-8 mb-3 text-center font-normal text-2xl">
          Selecciona la empresa a la que deseas acceder.
        </p>

        <div className="w-full max-w-6xl mx-auto mt-3 flex justify-center">
          <div className="flex justify-center w-[100%]">
            <div className="flex flex-wrap justify-center gap-6 w-full relative">

              {/* Flecha izquierda */}
              {currentPage > 0 && (
                <div
                  className="absolute left-0 top-1/2 md:ml-3 xl:mt-10 transform -translate-y-1/2 bg-[#5D6D7D] w-10 flex items-center justify-center rounded-l-3xl cursor-pointer"
                  style={{ height: "322px" }}
                  onClick={goToPreviousPage}
                >
                  <Image src={carruselIzq} alt="Carrusel izquierdo" width={24} height={24} />
                </div>
              )}

              {getCurrentPageItems().map((company) => (
                <div key={company.companyId} className="relative flex flex-col items-center md:mx-10 xl:mt-20">
                  <Tooltip title="Haz doble clic para entrar a la empresa" placement="top" arrow>
                    <div
                      onClick={() => handleCompanySelect(company.companyId)}
                      className={`flex flex-col items-center justify-center border-[#4197CB] border-4 p-4 transition duration-200 cursor-pointer ${
                        selectedCompanyId === company.companyId ? "shadow-inner" : "hover:shadow-lg"
                      } rounded-t-3xl relative`}
                      style={{
                        width: "245px",
                        height: "322px",
                        background:
                          selectedCompanyId === company.companyId
                            ? "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(228,228,228,1) 100%)"
                            : "transparent",
                        boxShadow:
                          selectedCompanyId === company.companyId
                            ? "0 2px 5px rgba(0,0,0,0.2)"
                            : "none",
                      }}
                    >
                      <Image src={Empresas} alt="empresa" width={120} height={120} />
                      <Tooltip title={company.companyName.length > 20 ? company.companyName : ""} placement="top" arrow>
                        <h3 className="text-lg font-semibold mt-2 text-center">
                          {company.companyName.length > 20
                            ? `${company.companyName.substring(0, 20)}...`
                            : company.companyName}
                        </h3>
                      </Tooltip>
                    </div>
                  </Tooltip>
                </div>
              ))}

              {/* Flecha derecha */}
              {(currentPage + 1) * itemsPerPage < companies.length && (
                <div
                  className="absolute right-0 top-1/2 md:mr-3 xl:mt-10 transform -translate-y-1/2 bg-[#5D6D7D] w-10 flex items-center justify-center rounded-r-3xl cursor-pointer"
                  style={{ height: "322px" }}
                  onClick={goToNextPage}
                >
                  <Image src={carruselDer} alt="Carrusel derecho" width={24} height={24} />
                </div>
              )}
            </div>
          </div>
        </div>
        {message && <ToastErrorMsg description={message} />}
      </div>
    </div>
  );
};

export default SelectedCompany;
