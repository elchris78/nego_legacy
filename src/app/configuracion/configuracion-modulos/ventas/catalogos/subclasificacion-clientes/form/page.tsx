import { Suspense } from "react";

import { ClientSubclassificationsProvider } from "../components/form/ClientSubclassificationsContext";
import ClientSubclassificationsFormComponents from "../components/form/ClientSubclassificationsFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClientSubclassificationsProvider>
        <ClientSubclassificationsFormComponents />
      </ClientSubclassificationsProvider>
    </Suspense>
  );
};

export default Page;
