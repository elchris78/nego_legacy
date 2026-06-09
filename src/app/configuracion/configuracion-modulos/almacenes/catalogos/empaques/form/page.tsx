import { Suspense } from "react";

import { EmpaquesProvider } from "../components/form/EmpaquesContext";
import EmpaquesFormComponents from "../components/form/EmpaquesFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EmpaquesProvider>
        <EmpaquesFormComponents />
      </EmpaquesProvider>
    </Suspense>
  );
};

export default Page;
