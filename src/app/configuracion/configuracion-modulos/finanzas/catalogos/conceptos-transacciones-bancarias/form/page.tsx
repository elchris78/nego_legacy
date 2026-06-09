import { Suspense } from "react";

import { ConceptosTransaccionesBancariasProvider } from "../components/form/ConceptosTransaccionesBancariasFormContext";
import ConceptosTransaccionesBancariasFormComponents from "../components/form/ConceptosTransaccionesBancariasFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ConceptosTransaccionesBancariasProvider>
        <ConceptosTransaccionesBancariasFormComponents />
      </ConceptosTransaccionesBancariasProvider>
    </Suspense>
  );
};

export default Page;
