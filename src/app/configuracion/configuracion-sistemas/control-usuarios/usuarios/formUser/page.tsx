import { Suspense } from "react";
import { UserFormProvider } from "../components/forms/UsersFormContext";
import { UsersFormComponents } from "../components/forms/UsersFormComponents";

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <UserFormProvider>
        <UsersFormComponents />
      </UserFormProvider>
    </Suspense>
  );
};

export default Page;
