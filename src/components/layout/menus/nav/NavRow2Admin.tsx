"use client";

import { AppBar, Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import Image from "next/image";

interface ButtonProps {
  label: string;
  route: string;
  imgSrc?: string;
}

interface NavFila2Props {
  tabs: ButtonProps[];
  companiesL: number | undefined;
}

const StyledAppBar = styled(AppBar)`
  background-color: white;
  box-shadow: none;
  height: auto;
  margin-top: 0;
`;

const StyledNavBox = styled(Box)`
  background-color: #5b6670;
  padding: 0;
  min-height: unset;
  width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const StyledMenuButton = styled(IconButton)`
  display: flex;
  color: white;
  margin-left: ${({ theme }) => theme.spacing(2.5)};
  ${({ theme }) => theme.breakpoints.up("lg")} {
    display: none;
  }
`;

const StyledTabsBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  justify-content: flex-start;
  height: auto;
  padding: 0;

  ${({ theme }) => theme.breakpoints.up("md")} {
    flex-direction: row;
  }
`;

interface NavButtonProps {
  selected?: boolean;
  fullWidth?: boolean;
}

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "fullWidth",
})<NavButtonProps>(({ theme, selected, fullWidth }) => ({
  minHeight: "35px",
  textTransform: "none",
  color: "white",
  width: fullWidth ? "100%" : "auto",
  borderRadius: 0,
  backgroundColor: selected ? "#202945" : "transparent",
  "&:hover": {
    backgroundColor: "#202945",
  },
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "12px",
  [theme.breakpoints.down("md")]: {
    width: "100vw",
  },
}));

const NavImage = styled(Image)({
  // Add any specific styling for the image here
});

export default function NavFila2({ tabs }: NavFila2Props) {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const isTabActive = (tabRoute: string) => {
    return (
      pathname === tabRoute ||
      (pathname === "/admin/home" && tabRoute === "/admin")
    );
  };

  return (
    <StyledAppBar position="static" sx={{ marginTop: 0, width: "100%" }}>
      <StyledNavBox>
        <StyledMenuButton edge="start" onClick={handleMenuToggle}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </StyledMenuButton>

        <StyledTabsBox
          sx={{
            display: { xs: isMenuOpen ? "flex" : "none", lg: "flex" },
            alignItems: "flex-start !important",
          }}
        >
          {tabs.map((tab, index) => (
            <Link
              key={index}
              href={tab.route}
              passHref
              style={{
                width: "auto",
                display: "block",
              }}
            >
              <NavButton selected={isTabActive(tab.route)}>
                {tab.imgSrc && (
                  <NavImage
                    src={tab.imgSrc}
                    alt={tab.label}
                    width={tab.label === "" ? 20 : 20}
                    height={tab.label === "" ? 20 : 20}
                  />
                )}
                {tab.label }
              </NavButton>
            </Link>
          ))}
        </StyledTabsBox>
      </StyledNavBox>
    </StyledAppBar>
  );
}
