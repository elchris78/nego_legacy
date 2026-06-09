import { Box, MenuItem, Typography} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { MenuItemType } from "./types";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import crearDrawer from "@/assets/crearDrawer.svg";

interface MenuItemIconComponentProps {
  item: MenuItemType;
  onToggle: (segment: string) => void;
  level: number;
  openMenus: { [key: string]: boolean };
  children?: React.ReactNode;
}

export const MenuItemIconComponent: React.FC<MenuItemIconComponentProps> = ({
  item,
  onToggle,
  level,
  openMenus,
  children,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openMenus[item.segment!];

  const handleClick = () => {
    // if (hasChildren) {
      // onToggle(item.segment!);
    // } else if (item.src) {
      console.log(item.src);
    // }
  };

  const menuItemStyle = {
    color: "#5B6670",
    fontWeight: level === 0 ? "bold" : "normal",
    pl: 2,
    py: 1,
    mt: level === 0 ? 1 : 0,
    backgroundColor: "white", // Blanco para nivel 0 sin hijos
    "&:hover": {
      backgroundColor: "#4197CB42",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const iconStyle = {
    width: "2rem", // Ancho del ícono
    height: "2rem", // Alto del ícono
    marginRight: level === 0 ? "0.25rem" : "0rem",// Espacio entre el ícono y el texto
    marginLeft: level === 0 ? "0rem" : "3rem",
    filter: item.title === "Configuración del sistema" ? "grayscale(100%) brightness(40%)" : "inherit",
  };

  const content = (
    <MenuItem sx={menuItemStyle}>
        {item.icon && level === 0 &&(
          <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src={item.icon as string}
                alt="Icon"
                style={iconStyle}
                width={32} // Ajusta según el tamaño que quieras
                height={32} // Ajusta según el tamaño que quieras
              />
          </Box>
        )}
    </MenuItem>
  );

  return (
    <Box>
        {content}
    </Box>
  );
};
