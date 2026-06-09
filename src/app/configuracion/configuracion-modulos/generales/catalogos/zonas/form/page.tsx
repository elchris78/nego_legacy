import { Suspense } from "react";

import { ZonasProvider } from "../components/form/ZonasContext";
import ZonasFormComponents from "../components/form/ZonasFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ZonasProvider>
        <ZonasFormComponents />
      </ZonasProvider>
    </Suspense>
  );
};

export default Page;
