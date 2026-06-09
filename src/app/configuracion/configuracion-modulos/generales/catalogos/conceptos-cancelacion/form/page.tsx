import { Suspense } from "react";
import { CancelacionConceptsProvider } from "../components/form/CancelacionContext";
import CancelacionFormComponents from "../components/form/CancelacionFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CancelacionConceptsProvider>
        <CancelacionFormComponents />
      </CancelacionConceptsProvider>
    </Suspense>
  );
};

export default Page;
