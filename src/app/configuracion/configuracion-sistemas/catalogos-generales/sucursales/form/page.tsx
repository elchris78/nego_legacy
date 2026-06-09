import { PlantillaFormProvider } from "../components/Forms/SucursalFormContext";
import { PlantillasFormComponents } from "../components/Forms/SucursalFormComponents";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PlantillaFormProvider>
        <PlantillasFormComponents />
      </PlantillaFormProvider>
    </Suspense>
  );
}
