import { Suspense } from "react";

import { CXCProvider } from "../components/form/CXCContext";
import CXCsFormComponents from "../components/form/CXCsFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CXCProvider>
        <CXCsFormComponents />
      </CXCProvider>
    </Suspense>
  );
};

export default Page;
