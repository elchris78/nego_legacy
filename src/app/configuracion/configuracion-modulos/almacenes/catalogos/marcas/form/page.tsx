 import { Suspense } from "react";
 
 import { MarcaFormProvider } from "../components/form/MarcaFormContext"; 
 import MarcaFormComponents from "../components/form/MarcaComponents";
 
 const Page = () => {
   return (
     <Suspense fallback={<div>Cargando...</div>}>
       <MarcaFormProvider>
         <MarcaFormComponents />
       </MarcaFormProvider>
     </Suspense>
   );
 };
 
 export default Page;
 