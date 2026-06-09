import { Suspense } from "react";

import { FabricantesProvider } from "../components/form/FabricantesContext";
import FabricantesFormComponents from "../components/form/FabricantesFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FabricantesProvider>
        <FabricantesFormComponents />
      </FabricantesProvider>
    </Suspense>
  );
};

export default Page;
