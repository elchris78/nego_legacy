import { Suspense } from "react";

import { ReturnConceptsProvider } from "../components/form/ReturnConceptsContext";
import ReturnConceptsFormComponents from "../components/form/ReturnConceptsFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReturnConceptsProvider>
        <ReturnConceptsFormComponents />
      </ReturnConceptsProvider>
    </Suspense>
  );
};

export default Page;
