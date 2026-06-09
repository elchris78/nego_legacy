import { GetSatCatalogResponse } from "../../services/CatalogsTypes";
import CatalogItem from "./CatalogItem";
import CatalogSatIcons from "./CatalogSatIcons";
import NotFoundCatalog from "./NotFoundCatalog";

interface Props {
  catalog: GetSatCatalogResponse[] | null;
}

const CatalogGrid = ({ catalog }: Props) => {
  const { categoryIcons } = CatalogSatIcons();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {catalog?.map((catalogItem) => (
        <CatalogItem
          key={catalogItem.internalName}
          catalogItem={catalogItem}
          icon={categoryIcons[catalogItem.internalName]}
        />
      ))}
      {catalog?.length === 0 && <NotFoundCatalog />}
    </div>
  );
};

export default CatalogGrid;
