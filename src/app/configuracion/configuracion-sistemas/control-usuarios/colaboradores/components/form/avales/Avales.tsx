import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import AvalesAccordion from "./AvalesAccordion";
import AvalFields from "./AvalFields";

const Avales = () => {
  const { handleAddAval, avalesFields } = useColaboradorFormContext();

  return (
    <div>
      {/* Texto y botón para agregar un aval del colaborador */}
      <div className="flex items-center gap-4">
        <label className="text-lg font-semibold text-gray-500">
          Avales del colaborador
        </label>
        <Button
          variant="default"
          onClick={handleAddAval}
          className="flex items-center gap-2"
          disabled={avalesFields.length >= 3}
          title={avalesFields.length >= 3 ? "Máximo 3 avales" : undefined}
        >
          <Plus size={22} strokeWidth={3} />
          Agregar
        </Button>
      </div>

      {/* Fields */}
      <div className="flex flex-col items-center gap-4 mt-4">
        {/* Mostrar sólo los campos si hay al menos uno */}
        {avalesFields.length === 1 && (
          <AvalFields field={avalesFields[0]} idx={0} />
        )}
        {/* Mostrar los acordiones si hay más de uno */}
        {avalesFields.length > 1 &&
          avalesFields.map((field, idx) => (
            <AvalesAccordion key={field.id} field={field} idx={idx} />
          ))}
      </div>
    </div>
  );
};

export default Avales;
