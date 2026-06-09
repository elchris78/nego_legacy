 import { Suspense } from "react";
 
 import { CategoriesFormProvider } from "../components/form/CategoriesFormContext"; 
 import CategoriesFormComponents from "../components/form/CategoriesComponents";
 
 const Page = () => {
   return (
     <Suspense fallback={<div>Cargando...</div>}>
       <CategoriesFormProvider>
         <CategoriesFormComponents />
       </CategoriesFormProvider>
     </Suspense>
   );
 };
 
 export default Page;
 