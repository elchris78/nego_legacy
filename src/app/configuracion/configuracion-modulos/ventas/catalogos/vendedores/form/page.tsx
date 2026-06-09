import { Suspense } from "react";

import { SellersProvider } from "../components/form/SellersContext";
import SellersFormComponents from "../components/form/SellersFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SellersProvider>
        <SellersFormComponents />
      </SellersProvider>
    </Suspense>
  );
};

export default Page;
