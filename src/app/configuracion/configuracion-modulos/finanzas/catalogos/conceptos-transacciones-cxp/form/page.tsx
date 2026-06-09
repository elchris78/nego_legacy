import { Suspense } from "react";

import { TransaccionesDXPProvider } from "../components/form/TransaccionesDXPContext";
import TransaccionesDXPFormComponents from "../components/form/TransaccionesDXPFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TransaccionesDXPProvider>
        <TransaccionesDXPFormComponents />
      </TransaccionesDXPProvider>
    </Suspense>
  );
};

export default Page;
