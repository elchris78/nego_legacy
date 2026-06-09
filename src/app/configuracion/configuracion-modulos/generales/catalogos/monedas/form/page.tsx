import { Suspense } from "react";

import { MonedasProvider } from "../components/form/MonedasContext";
import MonedasFormComponents from "../components/form/MonedasFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MonedasProvider>
        <MonedasFormComponents />
      </MonedasProvider>
    </Suspense>
  );
};

export default Page;
