import { Suspense } from "react";

import { EmpresaFormProvider } from "./components/EmpresaFormContext";
import EmpresaWrapComponents from "./components/EmpresaWrapComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmpresaFormProvider>
        <EmpresaWrapComponents />
      </EmpresaFormProvider>
    </Suspense>
  );
};

export default Page;
