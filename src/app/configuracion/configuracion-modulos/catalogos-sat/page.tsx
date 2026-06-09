"use client";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";
import { catalogSatActions } from "./services/catalogSatSlice";
import CatalogGrid from "./components/catalog/CatalogGrid";
import CatalogSatTitle from "./components/table/CatalogSatTitle";
import SearchCatalogSat from "./components/table/SearchCatalogSat";
import { GetSatCatalogResponse } from "./services/CatalogsTypes";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  // Catalogs Sat Redux
  const dispatch: AppDispatch = useDispatch();
  const catalogs = useSelector((state: RootState) => state.catalogSat.catalogs);
  const loading = useSelector((state: RootState) => state.catalogSat.loading);
  const error = useSelector((state: RootState) => state.catalogSat.error);

  // Filter data
  const [filteredCatalogs, setFilteredCatalogs] = useState<
    GetSatCatalogResponse[] | null
  >(catalogs);

  useEffect(() => {
    const token = Cookies.get("auth-token");
    dispatch(catalogSatActions.getCatalogs({ token }));
  }, [dispatch]);

  useEffect(() => {
    setFilteredCatalogs(catalogs);
  }, [catalogs]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-8 flex-grow">
      <CatalogSatTitle />
      <SearchCatalogSat
        catalog={catalogs}
        setFilteredCatalogs={setFilteredCatalogs}
      />
      <CatalogGrid catalog={filteredCatalogs} />
    </div>
  );
};

export default Page;
