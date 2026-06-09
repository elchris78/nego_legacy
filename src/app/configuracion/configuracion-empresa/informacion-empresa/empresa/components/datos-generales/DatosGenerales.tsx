import { ComicTooltip } from "@/components/ui/LabelTooltip";
import { HelpCircle } from "lucide-react";
import DatosComercialesForm from "./DatosComercialesForm";
import DatosEmpresaForm from "./DatosEmpresaForm";

const DatosGenerales = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Subtitle
          label="Datos de empresa"
          tooltip="Información general de la empresa"
        />
        <DatosEmpresaForm />
      </div>
      <div className="flex flex-col gap-4">
        <Subtitle
          label="Datos Comerciales"
          tooltip="Información comercial de la empresa"
        />
        <DatosComercialesForm />
      </div>
      <div>
        <span className="font-bold text-[#5D6D7E] text-sm">
          * Campos obligatorios
        </span>
      </div>
    </div>
  );
};

const Subtitle = ({ label, tooltip }: { label: string; tooltip: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <h2 className="text-2xl font-medium text-gray-600">{label}</h2>
      <ComicTooltip title={tooltip} arrow={false} placement="top-start">
        <HelpCircle className="h-4 w-5 text-[#5B89B4]" />
      </ComicTooltip>
    </div>
  );
};

export default DatosGenerales;
