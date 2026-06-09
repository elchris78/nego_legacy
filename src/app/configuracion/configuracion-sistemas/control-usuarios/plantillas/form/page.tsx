import { PlantillaFormProvider } from "../components/Forms/PlantillaFormContext";
import { PlantillasFormComponents } from "../components/Forms/PlantillasFormComponents";
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
