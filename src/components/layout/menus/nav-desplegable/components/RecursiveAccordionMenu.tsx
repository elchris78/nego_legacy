// components/RecursiveAccordionMenu.tsx
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface MenuItem {
  title: string;
  src?: string;
  children?: MenuItem[];
}

const RecursiveAccordionMenu = ({ items }: { items: MenuItem[] }) => {
  return (
    <Box>
      {items.map((item, index) => (
        <Accordion key={index} disableGutters>
          <AccordionSummary
            expandIcon={item.children ? <ExpandMoreIcon /> : null}
          >
            {item.src ? (
              <Link
                href={item.src}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography>{item.title}</Typography>
              </Link>
            ) : (
              <Typography>{item.title}</Typography>
            )}
          </AccordionSummary>
          {item.children && (
            <AccordionDetails>
              <RecursiveAccordionMenu items={item.children} />
            </AccordionDetails>
          )}
        </Accordion>
      ))}
    </Box>
  );
};

export default RecursiveAccordionMenu;
