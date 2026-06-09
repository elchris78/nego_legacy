import { Suspense } from "react";

import { TiposContratosBProvider } from "../components/form/TiposContratosBContext";
import TiposContratosBFormComponents from "../components/form/TiposContratosBFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TiposContratosBProvider>
        <TiposContratosBFormComponents />
      </TiposContratosBProvider>
    </Suspense>
  );
};

export default Page;
