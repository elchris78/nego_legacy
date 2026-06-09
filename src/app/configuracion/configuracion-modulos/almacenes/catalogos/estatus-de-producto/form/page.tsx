 import { Suspense } from "react";
 
 import { EstatusProdFormProvider } from "../components/form/EstatusProdFormContext"; 
 import EstatusProdFormComponents from "../components/form/EstatusProdFormComponents";
 
 const Page = () => {
   return (
     <Suspense fallback={<div>Cargando...</div>}>
       <EstatusProdFormProvider>
         <EstatusProdFormComponents />
       </EstatusProdFormProvider>
     </Suspense>
   );
 };
 
 export default Page;
 