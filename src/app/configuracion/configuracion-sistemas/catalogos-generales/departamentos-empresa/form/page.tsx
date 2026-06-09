import { DepartamentosFormComponents } from "../components/forms/DepartamentosFormComponents";
import { DepartamentosFormProvider } from "../components/forms/DepartamentosFormContext";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DepartamentosFormProvider>
        <DepartamentosFormComponents />
      </DepartamentosFormProvider>
    </Suspense>
  );
};
