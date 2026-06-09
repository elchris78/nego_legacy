import { Plus } from "lucide-react";
import { Button } from "@/ui/button";

interface DocumentacionDataProps {
  onAddClick: () => void;
}

export const DocumentacionData = ({ onAddClick }: DocumentacionDataProps) => {
  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-5 w-full">
        <h1 className="text-[#3c98cb] text-2xl font-semibold antialiased">
          Documentación
        </h1>
        <Button
          type="button"
          variant={"default"}
          onClick={onAddClick}
          className="bg-[#3C98CB] hover:bg-[#3788b4] w-full sm:w-auto flex items-center sm:gap-8"
        >
          <Plus className="h-5 w-5" />
          Agregar
        </Button>
      </div>
    </div>
  );
};
