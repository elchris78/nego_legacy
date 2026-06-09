import { Suspense } from "react";

import { CXPProvider } from "../components/form/CXPContext";
import CXPsFormComponents from "../components/form/CXPsFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CXPProvider>
        <CXPsFormComponents />
      </CXPProvider>
    </Suspense>
  );
};

export default Page;
