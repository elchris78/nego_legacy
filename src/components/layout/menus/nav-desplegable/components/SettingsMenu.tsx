// components/SettingsMenu.tsx
import { Menu } from "@mui/material";
import RecursiveAccordionMenu from "./RecursiveAccordionMenu";

interface SettingsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  items: any[]; // Ajusta el tipo según sea necesario
}

const SettingsMenu = ({ anchorEl, onClose, items }: SettingsMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <RecursiveAccordionMenu items={items} />
    </Menu>
  );
};

export default SettingsMenu;
