import { Suspense } from "react";

import { ClientTypesProvider } from "../components/form/ClientTypeContext";
import ClientTypesFormComponents from "../components/form/ClientTypeFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClientTypesProvider>
        <ClientTypesFormComponents />
      </ClientTypesProvider>
    </Suspense>
  );
};

export default Page;
