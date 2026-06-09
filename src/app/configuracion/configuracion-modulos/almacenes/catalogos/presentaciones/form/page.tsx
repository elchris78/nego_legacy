 import { Suspense } from "react";
 
 import { PresentacionesFormProvider } from "../components/form/PresentacionesFormContext"; 
 import PresentacionesFormComponents from "../components/form/PresentacionesComponents";
 
 const Page = () => {
   return (
     <Suspense fallback={<div>Cargando...</div>}>
       <PresentacionesFormProvider>
         <PresentacionesFormComponents />
       </PresentacionesFormProvider>
     </Suspense>
   );
 };
 
 export default Page;
 