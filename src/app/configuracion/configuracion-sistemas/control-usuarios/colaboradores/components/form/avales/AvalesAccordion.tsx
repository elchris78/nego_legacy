import { FieldArrayWithId } from "react-hook-form";
import { Trash2 } from "lucide-react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { AvalColaboradorFormValues } from "../../../services/colaboradoresFormsTypes";
import { ordinalConAjuste } from "@/lib/utils/ordinals";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import AvalFields from "./AvalFields";
import Down from "@/assets/down.svg";

const accordionStyles = {
  boxShadow: "none",
  border: "2px solid #E0E0E0",
  borderRadius: "10px",
  // Anula los estilos de MUI para el primer y último elemento del grupo
  "&:first-of-type, &:last-of-type": {
    borderRadius: "10px",
  },
  "&.Mui-expanded": {
    borderRadius: "8px",
  },
  "&::before": {
    display: "none",
  },
};

const summaryStyles = {
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
};

const AccordionTitle = ({ title }: { title: string }) => {
  return (
    <Typography component="h2" color="#5D6D7E" fontWeight="200" fontSize="20px">
      {title}
    </Typography>
  );
};

interface Props {
  field: FieldArrayWithId<AvalColaboradorFormValues, "avales", "id">;
  idx: number;
}

const AvalesAccordion = ({ field, idx }: Props) => {
  const { handleRemoveAval, handleRemoveDocumentacionAval } =
    useColaboradorFormContext();

  const ordinalNumberAndLabel = ordinalConAjuste(
    idx + 1,
    "aval del colaborador"
  );

  // Handle the removal of an aval and its associated documentation
  const onHandleRemoveAval = (index: number) => {
    handleRemoveAval(index);
    handleRemoveDocumentacionAval(index);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <Accordion disableGutters sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<Down />}
          sx={summaryStyles}
          aria-controls={`aval-${idx}-content`}
          id={`aval-${idx}-header`}
        >
          <AccordionTitle title={ordinalNumberAndLabel} />
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <span className="font-medium text-gray-600">
                {ordinalNumberAndLabel}
              </span>
              <Trash2
                className="text-gray-600 cursor-pointer transition-all hover:text-red-500"
                size={16}
                onClick={() => onHandleRemoveAval(idx)}
              />
            </div>
            <AvalFields key={field.id} field={field} idx={idx} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AvalesAccordion;
