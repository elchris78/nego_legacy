import { useState } from "react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { AppBar, IconButton, Button, Box, styled } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ButtonProps {
  label?: string;
  route: string;
  imgSrc?: string;
  icon: React.ReactNode;
}

interface NavDesplegableRow2Props {
  tabs: ButtonProps[];
  isMenuOpen: boolean; // Recibe el estado del menú
  onMenuToggle: () => void; // Recibe la función para alternar el menú
}

const StyledAppBar = styled(AppBar)({
  backgroundColor: "white",
  boxShadow: "none",
  height: "auto",
  marginTop: 0,
});

const NavDesplegableRow2 = ({
  tabs,
  isMenuOpen,
  onMenuToggle,
}: NavDesplegableRow2Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();

  const handleTabClick = (segment: string) => {
    console.log(segment);
    setSelectedOption(segment); // Actualizar la opción seleccionada
    router.push(segment);
  };

  return (
    <StyledAppBar position="static">
      <Box
        sx={{
          backgroundColor: "#5B6670",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <IconButton
          edge="start"
          onClick={onMenuToggle} // Llama la función del padre para alternar el estado
          sx={{ display: { lg: "none" }, ml: { xs: 2.5, md: 5.5 } }}
        >
          {isMenuOpen ? (
            <CloseIcon sx={{ color: "white" }} />
          ) : (
            <MenuIcon sx={{ color: "white" }} />
          )}
        </IconButton>

        {/* Contenedor de las pestañas */}
        <Box
          display={{ xs: isMenuOpen ? "flex" : "none", lg: "flex" }}
          flexDirection={{ xs: "column", lg: "row" }}
          alignItems="center"
          width="100%"
          justifyContent="start"
        >
          {tabs.map((tab, index) => (
            <Button
              key={index}
              onClick={() => handleTabClick(tab.route)}
              sx={{
                textTransform: "none",
                color: "white",
                display: "flex",
                gap: 1,
                alignItems: "center",
                borderRadius: 0,
                "&:hover": { backgroundColor: "#202945" },
                margin: 0,
              }}
            >
              <div className="flex items-center justify-center h-full gap-1">
                <div className={`${tab.label == "Contabilidad" ? "text-2xl": "text-[10px]"}`}>{tab?.icon}</div>
                <span className="font-bold text-sm">{tab?.label}</span>
              </div>
            </Button>
          ))}
        </Box>
      </Box>
    </StyledAppBar>
  );
};

export default NavDesplegableRow2;
