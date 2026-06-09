import { UserFormProvider } from "../components/Forms/UserFormContext";
import { UsersFormComponents } from "../components/Forms/UsersFormComponents";
import { Suspense } from 'react';

export default function UserForm() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <UserFormProvider>
        <UsersFormComponents />
      </UserFormProvider>
    </Suspense>
  );
}
