"use client";

import React, { useState } from "react";
import TitleCat from "./components/TitleCat";
import SearchCatalog from "./components/SearchCatalog";
import CatalogItem from "./components/CatalogItem";
import { catalogData } from "./components/RutasCatGeneral";
import NoCat from "./components/NoCat";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const page = () => {
  const [search, setSearch] = useState("");

  const claims = useSelector((state: RootState) => state.claims.data);
  const hasClaim = (claimValue: string) => {
    return claims?.some(
      (claim: { claimValue: string }) => claim.claimValue === claimValue
    );
  };

  const filteredCatalog = catalogData
    .filter((item) => {
      if (!item.claimValue) return true; // Si no tiene claimValue, mostrarlo siempre
      return hasClaim(item.claimValue); // Si tiene claimValue, validar con claims del usuario
    })
    .filter((item) =>
      `${item.segment} ${item.title}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    // .sort((a, b) => {
    //   if (a.segment < b.segment) return -1;
    //   if (a.segment > b.segment) return 1;
    //   return 0;
    // });

  return (
    <div className="mt-8 md:mt-12">
      <TitleCat />
      <SearchCatalog search={search} setSearch={setSearch} />

      {/* Mostrar mensaje si no se encuentran resultados */}
      {filteredCatalog.length === 0 ? (
        <NoCat />
      ) : (
        // Si hay resultados, mostramos las tarjetas
        <CatalogItem catalogData={filteredCatalog} />
      )}
    </div>
  );
};

export default page;
