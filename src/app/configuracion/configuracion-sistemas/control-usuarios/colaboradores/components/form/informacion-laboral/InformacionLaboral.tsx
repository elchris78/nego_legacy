import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Down from "@/assets/down.svg";
import DatosLaboralesForm from "./DatosLaboralesForm";
import HistorialLaboralForm from "./HistorialLaboralForm";
import Typography from "@mui/material/Typography";

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

const InformacionLaboral = () => {
  return (
    <div className="flex flex-col gap-6">
      <Accordion disableGutters sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<Down />}
          sx={summaryStyles}
          aria-controls="datos-laborales-content"
          id="datos-laborales-header"
        >
          <AccordionTitle title="Datos laborales" />
        </AccordionSummary>
        <AccordionDetails>
          <DatosLaboralesForm />
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<Down />}
          sx={summaryStyles}
          aria-controls="historial-laboral-content"
          id="historial-laboral-header"
        >
          <AccordionTitle title="Historial laboral" />
        </AccordionSummary>
        <AccordionDetails>
          <HistorialLaboralForm />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default InformacionLaboral;
