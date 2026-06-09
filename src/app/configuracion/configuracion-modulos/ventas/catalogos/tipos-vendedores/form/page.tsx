import { Suspense } from "react";

import { SellersTypesProvider } from "../components/form/SellersTypeContext";
import SellersTypesFormComponents from "../components/form/SellersTypeFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SellersTypesProvider>
        <SellersTypesFormComponents />
      </SellersTypesProvider>
    </Suspense>
  );
};

export default Page;
