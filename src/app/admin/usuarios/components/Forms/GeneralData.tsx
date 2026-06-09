import { GeneralDataForm } from "./GeneralDataForm";

export const GeneralData = () => {
  return (
    <div className="gap-2 md:grid-cols-4 md:grid-rows-1 grid-cols-1 grid-rows-12">
      <div className="md:col-span-3 row-span-10 md:row-span-1 ">
        <GeneralDataForm />
      </div>
    </div>
  );
};
