import { Box, MenuItem, Typography} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { MenuItemType } from "./types";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import crearD from "@/assets/crearD.png";
import { usePathname } from "next/navigation"
// import { selectedSecondLevel } from "./selectedSecondLevel"; // Ya no debería ser necesario
// import { selectedThirdLevel } from "./selectedSecondLevel";

interface MenuItemComponentProps {
  item: MenuItemType;
  onToggle: (segment: string) => void;
  level: number;
  openMenus: { [key: string]: boolean };
  children?: React.ReactNode;
}

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  onToggle,
  level,
  openMenus,
  children,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openMenus[item.segment!];
  const pathname = usePathname();
  // console.log("ruta:", pathname);

  // Se resalta únicamente si el ítem tiene un src y coincide exactamente con el pathname actual
  const isHighlighted = item.src ? pathname.startsWith(item.src) : false;


  const handleClick = () => {
    if (hasChildren) {
      onToggle(item.segment!);
    } else if (item.src) {
      console.log(item.src);
    }
  };

  const menuItemStyle = {
    color: isOpen ? (level === 0 ? "white" : "#5B6670") : "#5B6670",
    fontWeight: isHighlighted ? 800 : (level === 0 ? "bold" : "normal"),
    pl: level === 2 && hasChildren ? 3.5 : 2,
    py: 1,
    mt: level === 0 ? 1 : 0,
    backgroundColor: isHighlighted
      ? "#4197CB42"
      : isOpen
      ? level === 0
        ? "#202945"
        : "white"
      : "white",
    "&:hover": {
      backgroundColor: level === 0
        ? isOpen
          ? "#202945"
          : "#4197CB42"
        : "#4197CB42",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "background-color 0.3s, color 0.3s",
  };

  const iconStyle = {
    width: level === 0 ? "2.25rem" : "1.5rem",
    height: level === 0 ? "2.25rem" : "1.5rem",
    marginRight: level === 0 ? "0.25rem" : "0rem",
    marginLeft: 0,
    filter:
      item.title === "Configuración del sistema" && !isOpen
        ? "grayscale(100%) brightness(40%)"
        : isOpen && level === 0
        ? "grayscale(100%) brightness(1000%)"
        : "inherit",
  };

  const iconCreateStyle = {
    width: "1.5rem",
    height: "1.5rem",
    color: "#4197CB",
  };

  const content = (
    <MenuItem sx={menuItemStyle} onClick={handleClick}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
        {item.icon && (
          <Image
            src={item.icon as string}
            alt="Icon"
            style={iconStyle}
            width={32}
            height={32}
          />
        )}
        {item.src && level > 1 && (
          <Typography
            sx={{
              color: "#5B6670",
              fontSize: "1rem",
              display: "inline",
              ml: 2,
            }}
          >
            •
          </Typography>
        )}
        <Typography
          sx={{
            ml: item.src || item.icon ? 0.5 : level === 0 ? 0 : 1,
            mt: item.createOption ? 0.25 : 0,
            fontWeight: isHighlighted ? 800 : (level === 0 || level === 1 ? 800 : 400),
            fontSize:
              level === 0 ? '16px' :
              level === 1 ? '14px' :
              level === 2 ? '14px' :
              level === 3 ? '12px' :
              '18px',
            maxWidth: "320px",
            whiteSpace: "normal",
            wordWrap: "break-word",
            color: isOpen
              ? level === 0
                ? "white"
                : "#5B6670"
              : "#5B6670",
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </Typography>
      </Box>
      {item.createOption && item.createSrc && (
        <Link href={item.createSrc} passHref>
          <Image
            src={crearD}
            alt="Create Option"
            style={iconCreateStyle}
            width={16}
            height={16}
          />
        </Link>
      )}
      {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
    </MenuItem>
  );

  return (
    <Box>
      {item.src ? (
        <Link
          href={item.src}
          passHref
          style={{ textDecoration: "none", width: "300px" }}
        >
          {content}
        </Link>
      ) : (
        content
      )}
      {children}
    </Box>
  );
};

