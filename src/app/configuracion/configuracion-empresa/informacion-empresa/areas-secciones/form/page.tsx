import { Suspense } from "react";

import { AreaFormProvider } from "../components/form/AreaFormContext";
import AreaFormComponents from "../components/form/AreaFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AreaFormProvider>
        <AreaFormComponents />
      </AreaFormProvider>
    </Suspense>
  );
};

export default Page;