import { FieldArrayWithId } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import { ContactoEmergenciaFormValues } from "../../../services/colaboradoresFormsTypes";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useColaboradorFormContext } from "../ColaboradorFormContext";

interface Props {
  field: FieldArrayWithId<
    ContactoEmergenciaFormValues,
    "contactosEmergencia",
    "id"
  >;
  idx: number;
}

const ColaboradorFields = ({ field, idx }: Props) => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { contactoEmergenciaForm } = useColaboradorFormContext();

  const {
    register,
    formState: { errors },
  } = contactoEmergenciaForm;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Nombre completo */}
        <div>
          <LabelTooltip
            label="Nombre completo"
            tooltip="Información de una o más personas que pueden ser contactadas en caso de emergencia. Debe incluir nombre completo y número(s) telefónico(s)."
            htmlFor="full-name-input"
          />
          <Input
            id="full-name-input"
            type="text"
            placeholder="Ingresa el nombre completo"
            isError={!!errors.contactosEmergencia?.[idx]?.nombreCompleto}
            disabled={mode === "view"}
            {...register(`contactosEmergencia.${idx}.nombreCompleto`)}
          />
          {errors.contactosEmergencia?.[idx]?.nombreCompleto && (
            <span className="text-[#CF5459] text-xs">
              {errors.contactosEmergencia[idx].nombreCompleto.message}
            </span>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <LabelTooltip
            label="Teléfono"
            tooltip="Información de una o más personas que pueden ser contactadas en caso de emergencia. Debe incluir nombre completo y número(s) telefónico(s)."
            htmlFor="phone-input"
          />
          <Input
            id="phone-input"
            type="tel"
            placeholder="Ingresa el número de teléfono"
            isError={!!errors.contactosEmergencia?.[idx]?.telefono}
            disabled={mode === "view"}
            {...register(`contactosEmergencia.${idx}.telefono`)}
          />
          {errors.contactosEmergencia?.[idx]?.telefono && (
            <span className="text-[#CF5459] text-xs">
              {errors.contactosEmergencia[idx].telefono.message}
            </span>
          )}
        </div>
      </div>

      <SubSectionLabel text="Beneficiario" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Nombre completo beneficiario */}
        <div>
          <LabelTooltip
            label="Nombre completo beneficiario"
            tooltip="Persona designada como beneficiaria para efectos legales, de seguros o prestaciones. Debe incluir nombre completo y número de identificación oficial (INE)."
            htmlFor="beneficiary-full-name-input"
          />
          <Input
            id="beneficiary-full-name-input"
            type="text"
            placeholder="Ingresa el nombre completo del beneficiario"
            isError={!!errors.contactosEmergencia?.[idx]?.nombreBeneficiario}
            disabled={mode === "view"}
            {...register(`contactosEmergencia.${idx}.nombreBeneficiario`)}
          />
          {errors.contactosEmergencia?.[idx]?.nombreBeneficiario && (
            <span className="text-[#CF5459] text-xs">
              {errors.contactosEmergencia[idx].nombreBeneficiario.message}
            </span>
          )}
        </div>

        {/* Número INE beneficiario */}
        <div>
          <LabelTooltip
            label="Número INE beneficiario"
            tooltip="Persona designada como beneficiaria para efectos legales, de seguros o prestaciones. Debe incluir nombre completo y número de identificación oficial (INE)."
            htmlFor="beneficiary-ine-input"
          />
          <Input
            id="beneficiary-ine-input"
            type="text"
            placeholder="Ingresa el número INE del beneficiario"
            isError={!!errors.contactosEmergencia?.[idx]?.ineBeneficiario}
            disabled={mode === "view"}
            {...register(`contactosEmergencia.${idx}.ineBeneficiario`)}
          />
          {errors.contactosEmergencia?.[idx]?.ineBeneficiario && (
            <span className="text-[#CF5459] text-xs">
              {errors.contactosEmergencia[idx].ineBeneficiario.message}
            </span>
          )}
        </div>
      </div>

      <SubSectionLabel text="Otros datos" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Historial médico */}
        <div>
          <LabelTooltip
            label="Historial médico"
            tooltip="Resumen o información relevante sobre condiciones médicas previas del colaborador. Puede incluir alergias, enfermedades crónicas o antecedentes importantes, si aplica."
            htmlFor="medical-history-textarea"
          />
          <Input
            id="medical-history-textarea"
            type="text"
            placeholder="Ingresa el historial médico"
            isError={!!errors.contactosEmergencia?.[idx]?.historialMedico}
            disabled={mode === "view"}
            {...register(`contactosEmergencia.${idx}.historialMedico`)}
          />
          {errors.contactosEmergencia?.[idx]?.historialMedico && (
            <span className="text-[#CF5459] text-xs">
              {errors.contactosEmergencia[idx].historialMedico.message}
            </span>
          )}
        </div>

        {/* Notas adicionales */}
        <div>
          <LabelTooltip
            label="Notas adicionales"
            tooltip="Campo de texto destinado a registrar cualquier observación o información complementaria que no esté contemplada en los campos anteriores."
            htmlFor="additional-notes-input"
          />
          <Input
            id="additional-notes-input"
            type="text"
            placeholder="Ingresa notas adicionales"
            isError={!!errors.contactosEmergencia?.[idx]?.notasAdicionales}
            disabled={mode === "view"}
            {...register(`contactosEmergencia.${idx}.notasAdicionales`)}
          />
          {errors.contactosEmergencia?.[idx]?.notasAdicionales && (
            <span className="text-[#CF5459] text-xs">
              {errors.contactosEmergencia[idx].notasAdicionales.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const SubSectionLabel = ({ text }: { text: string }) => {
  return (
    <div className="mt-4">
      <span className="font-medium text-gray-600">{text}</span>
    </div>
  );
};

export default ColaboradorFields;
