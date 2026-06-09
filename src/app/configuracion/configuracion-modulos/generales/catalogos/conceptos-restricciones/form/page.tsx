import { Suspense } from "react";

import { RestrictionConceptsProvider } from "../components/form/RestrictionConceptsContext";
import RestrictionConceptsFormComponents from "../components/form/RestrictionConceptsFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RestrictionConceptsProvider>
        <RestrictionConceptsFormComponents />
      </RestrictionConceptsProvider>
    </Suspense>
  );
};

export default Page;
