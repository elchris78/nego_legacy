import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  styled,
} from "@mui/material"
import { ArrowBack } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react"

  interface NavRow3Props {
    textPagina: string;
    goBackPath: string;
  }

  const StyledAppBar = styled(AppBar)({
    backgroundColor: 'white',
    boxShadow: 'none',
    height: 'auto',
    marginTop: 0,
  });

  export const NavRow3 = ({ textPagina, goBackPath = "/admin" }: NavRow3Props) => {
    const pathname = usePathname();
    const router = useRouter();
  
    return (
      <StyledAppBar position="static">
        <Box
          sx={{
            backgroundColor: "#3C98CB",
            color: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            padding:0.3
          }}
        >
          <Typography
            sx={{
              ml: 1,
              my: 0.2,
              textAlign: "left",  
              fontSize: "12px"
            }}
          >
            {textPagina}
          </Typography>
        </Box>
      </StyledAppBar>
    );
  };
  
export default NavRow3
