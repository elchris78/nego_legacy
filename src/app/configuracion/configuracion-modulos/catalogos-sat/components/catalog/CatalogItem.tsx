import { GetSatCatalogResponse } from "../../services/CatalogsTypes";
import CatalogDropdownButton from "./CatalogDropdownButton";

interface Props {
  catalogItem: GetSatCatalogResponse;
  icon: JSX.Element;
}

const CatalogItem = ({ catalogItem, icon }: Props) => {
  return (
    <div className="bg-white shadow-md border-2 border-[#3C98CB] rounded-md p-2 min-h-48 hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="flex justify-end">
        <CatalogDropdownButton catalogValue={catalogItem?.internalName} />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-[#b8b8b8]">{icon}</div>
        <h3 className="text-xl text-center font-light">{catalogItem.name}</h3>
      </div>
    </div>
  );
};

export default CatalogItem;
