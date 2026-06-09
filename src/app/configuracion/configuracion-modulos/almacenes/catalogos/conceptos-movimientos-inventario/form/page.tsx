import { Suspense } from "react";

import { MovimientoInventarioProvider } from "../components/form/MovimientoInventarioFormContext";
import MovimientosInventarioFormComponents from "../components/form/MovimientosInventarioFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MovimientoInventarioProvider>
        <MovimientosInventarioFormComponents />
      </MovimientoInventarioProvider>
    </Suspense>
  );
};

export default Page;
