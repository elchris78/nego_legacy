import { Suspense } from "react";

import { KeyConfigurationProvider } from "../components/form/KeyConfigurationContext";
import KeyConfigurationFormComponents from "../components/form/KeyConfigurationFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <KeyConfigurationProvider>
        <KeyConfigurationFormComponents />
      </KeyConfigurationProvider>
    </Suspense>
  );
};

export default Page;
