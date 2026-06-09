import { Suspense } from "react";

import { SucursalProvider } from "../components/form/SucursalesFormContext";
import SucursalFormComponents from "../components/form/SucursalesFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SucursalProvider>
        <SucursalFormComponents />
      </SucursalProvider>
    </Suspense>
  );
};

export default Page;
