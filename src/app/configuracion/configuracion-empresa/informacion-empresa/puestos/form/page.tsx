import { Suspense } from "react";

import { PuestosFormProvider } from "../components/form/PuestosFormContext"; 
import PuestosFormComponents from "../components/form/PuestosFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PuestosFormProvider>
        <PuestosFormComponents />
      </PuestosFormProvider>
    </Suspense>
  );
};

export default Page;
