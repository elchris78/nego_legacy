import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import DomicilioFiscalForm from "./DomicilioFiscalForm";
import DomicilioParticularForm from "./DomicilioParticularForm";
import Down from "@/assets/down.svg";
import InformacionGeneralForm from "./InformacionGeneralForm";
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

const DatosGenerales = () => {
  return (
    <div className="flex flex-col gap-6">
      <Accordion disableGutters sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<Down />}
          sx={summaryStyles}
          aria-controls="informacion-general-content"
          id="informacion-general-header"
        >
          <AccordionTitle title="Información general" />
        </AccordionSummary>
        <AccordionDetails>
          <InformacionGeneralForm />
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<Down />}
          sx={summaryStyles}
          aria-controls="domicilio-fiscal-content"
          id="domicilio-fiscal-header"
        >
          <AccordionTitle title="Domicilio fiscal" />
        </AccordionSummary>
        <AccordionDetails>
          <DomicilioFiscalForm />
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<Down />}
          sx={summaryStyles}
          aria-controls="domicilio-particular-content"
          id="domicilio-particular-header"
        >
          <AccordionTitle title="Domicilio particular" />
        </AccordionSummary>
        <AccordionDetails>
          <DomicilioParticularForm />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DatosGenerales;
