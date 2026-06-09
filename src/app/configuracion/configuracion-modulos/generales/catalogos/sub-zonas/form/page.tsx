import { Suspense } from "react";

import { SubZonasProvider } from "../components/form/SubZonasContext";
import SubZonasComponents from "../components/form/SubZonasComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SubZonasProvider>
        <SubZonasComponents />
      </SubZonasProvider>
    </Suspense>
  );
};

export default Page;
