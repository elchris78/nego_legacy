import { Suspense } from "react";

import { ColaboradorFormProvider } from "../components/form/ColaboradorFormContext";
import ColaboradorFormComponents from "../components/form/ColaboradorFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ColaboradorFormProvider>
        <ColaboradorFormComponents />
      </ColaboradorFormProvider>
    </Suspense>
  );
};

export default Page;
