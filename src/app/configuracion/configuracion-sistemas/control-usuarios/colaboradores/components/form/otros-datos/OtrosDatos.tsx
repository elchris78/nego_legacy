import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import ColaboradoresAccordion from "./ColaboradoresAccordion";
import ColaboradorFields from "./ColaboradorFields";

const OtrosDatos = () => {
  const { handleAddEmergencyContact, contactosEmergenciaFields } =
    useColaboradorFormContext();

  return (
    <div>
      {/* Texto y botón para agregar un contacto de emergencia */}
      <div className="flex items-center gap-4">
        <label className="text-lg font-semibold text-gray-500">
          Contacto de emergencia
        </label>
        <Button
          variant="default"
          onClick={handleAddEmergencyContact}
          className="flex items-center gap-2"
          disabled={contactosEmergenciaFields.length >= 3}
          title={
            contactosEmergenciaFields.length >= 3
              ? "Máximo 3 contactos"
              : undefined
          }
        >
          <Plus size={22} strokeWidth={3} />
          Agregar
        </Button>
      </div>

      {/* Fields */}
      <div className="flex flex-col items-center gap-4 mt-4">
        {/* Mostrar sólo los campos si hay al menos uno */}
        {contactosEmergenciaFields.length === 1 && (
          <ColaboradorFields field={contactosEmergenciaFields[0]} idx={0} />
        )}
        {/* Mostrar los acordiones si hay más de uno */}
        {contactosEmergenciaFields.length > 1 &&
          contactosEmergenciaFields.map((field, idx) => (
            <ColaboradoresAccordion key={field.id} field={field} idx={idx} />
          ))}
      </div>
    </div>
  );
};

export default OtrosDatos;
