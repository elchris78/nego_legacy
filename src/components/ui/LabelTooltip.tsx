import { HelpCircle } from "lucide-react";
import { styled } from "@mui/material/styles"
import Tooltip, { type TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"

export const ComicTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#3C98CB", // Azul más claro
    border: "2px solid #BDC3C7", // Borde gris más oscuro
    padding: "12px 20px",
    fontSize: "0.875rem",
    maxWidth: 300,
    position: "relative",
    borderRadius: "20px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "15px",
      height: "15px",
      background: "white",
      border: "1px solid #BDC3C7",
      borderRight: "none",
      borderTop: "none",
      top: "85%",
      left: "-8px",
      transform: "translateY(-50%) rotate(25deg)",
      transformOrigin: "center",
    },
  },
}))
interface Props {
  label: string;
  tooltip?: string;
  htmlFor?: string;
  className?: string; 
}

export const LabelTooltip = ({ label, tooltip, htmlFor, className }: Props) => {
  return (
    <div className={`flex items-center space-x-2 ${className ?? ""}`}>
      <label htmlFor={htmlFor} className="font-semibold text-[#5D6D7E] text-[15px]">
        {label}
      </label>
      <ComicTooltip
        title={tooltip}
        arrow={false}
        placement="top-start"
      >
        <HelpCircle className="h-4 w-5 text-[#5B89B4]" />
      </ComicTooltip>
    </div>
  );
};
