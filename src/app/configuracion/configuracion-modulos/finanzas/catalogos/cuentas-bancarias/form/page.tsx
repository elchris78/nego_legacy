import { Suspense } from "react";

import { CuentaBancariaProvider } from "../components/form/CuentaBancariaFormContext";
import CuentaBancariaFormComponents from "../components/form/CuentaBancariaFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CuentaBancariaProvider>
        <CuentaBancariaFormComponents />
      </CuentaBancariaProvider>
    </Suspense>
  );
};

export default Page;
