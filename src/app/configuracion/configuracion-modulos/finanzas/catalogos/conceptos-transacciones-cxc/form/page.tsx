import { Suspense } from "react";

import { TransaccionesDXCProvider } from "../components/form/TransaccionesDXCContext";
import TransaccionesDXCFormComponents from "../components/form/TransaccionesDXCFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TransaccionesDXCProvider>
        <TransaccionesDXCFormComponents />
      </TransaccionesDXCProvider>
    </Suspense>
  );
};

export default Page;
