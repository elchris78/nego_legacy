 import { Suspense } from "react";
 
 import { EstatusProdFormProvider } from "../components/form/TypesWarehousesFormContext"; 
 import TypesWarehousesFormComponents from "../components/form/TypesWarehousesFormComponents";
 
 const Page = () => {
   return (
     <Suspense fallback={<div>Cargando...</div>}>
       <EstatusProdFormProvider>
         <TypesWarehousesFormComponents />
       </EstatusProdFormProvider>
     </Suspense>
   );
 };
 
 export default Page;
 