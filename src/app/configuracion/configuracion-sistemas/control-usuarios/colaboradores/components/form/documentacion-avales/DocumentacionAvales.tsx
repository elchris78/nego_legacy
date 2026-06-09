import { useColaboradorFormContext } from "../ColaboradorFormContext";
import DocumentacionAvalFields from "./DocumentacionAvalFields";
import DocumentacionAvalAccordion from "./DocumentacionAvalAccordion";

const DocumentacionAvales = () => {
  const { documentacionAvalesFields } = useColaboradorFormContext();

  return (
    <div>
      {/* Texto y botón para agregar un aval del colaborador */}
      <div className="flex items-center gap-4">
        <label className="text-lg font-semibold text-gray-500">
          Documentación de avales
        </label>
      </div>

      {/* Fields */}
      <div className="flex flex-col items-center gap-4 mt-4">
        {/* Mostrar sólo los campos si hay al menos uno */}
        {documentacionAvalesFields.length === 1 && (
          <DocumentacionAvalFields
            field={documentacionAvalesFields[0]}
            idx={0}
          />
        )}
        {/* Mostrar los acordiones si hay más de uno */}
        {documentacionAvalesFields.length > 1 &&
          documentacionAvalesFields.map((field, idx) => (
            <DocumentacionAvalAccordion
              key={field.id}
              field={field}
              idx={idx}
            />
          ))}
      </div>
    </div>
  );
};

export default DocumentacionAvales;
