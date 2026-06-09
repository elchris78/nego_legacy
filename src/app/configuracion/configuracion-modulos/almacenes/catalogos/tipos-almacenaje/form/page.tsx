 import { Suspense } from "react";
 
 import { EstatusProdFormProvider } from "../components/form/TiposAlmacenajeContext"; 
 import TiposAlmacenajeFormComponents from "../components/form/TiposAlmacenajeFormComponents";
 
 const Page = () => {
   return (
     <Suspense fallback={<div>Cargando...</div>}>
       <EstatusProdFormProvider>
         <TiposAlmacenajeFormComponents />
       </EstatusProdFormProvider>
     </Suspense>
   );
 };
 
 export default Page;
 