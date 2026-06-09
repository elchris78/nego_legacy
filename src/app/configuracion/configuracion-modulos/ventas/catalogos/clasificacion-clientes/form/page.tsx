import { Suspense } from "react";

import { ClientClassificationsProvider } from "../components/form/ClientClassificationsContext";
import ClientClassificationsFormComponents from "../components/form/ClientClassificationsFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClientClassificationsProvider>
        <ClientClassificationsFormComponents />
      </ClientClassificationsProvider>
    </Suspense>
  );
};

export default Page;
