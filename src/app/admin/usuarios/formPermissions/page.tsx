import { Suspense } from "react";
import { UserFormProvider } from "../components/Forms/UserFormContext";
import { UsersFormComponents } from "../components/Forms/PermissionsFormComponents"; 

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
