import { Suspense } from "react";

import { AttributesProvider } from "../components/form/AttributesContext";
import AttributesFormComponents from "../components/form/AttributesFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AttributesProvider>
        <AttributesFormComponents />
      </AttributesProvider>
    </Suspense>
  );
};

export default Page;
