import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { styled } from "@mui/system";

interface ActionMenuProps {
  actions: { label: string; icon: React.ReactNode; onClick: () => void }[];
}

const HorizontalMenu = styled(Menu)(() => ({
  "& .MuiPaper-root": {
    minWidth: "auto",
    padding: "4px",
  },
  "& .MuiList-root": {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  },
  "& .MuiMenuItem-root": {
    padding: "6px 8px",
    minWidth: "auto",
    whiteSpace: "nowrap",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
}));

const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} size="small">
        <MoreHorizIcon />
      </IconButton>

      <HorizontalMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        style={{ marginBottom: "8px" }} // Adds a small gap between menu and icon
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick();
              handleClose();
            }}
          >
            <Tooltip title={action.label} placement="top" arrow>
              <IconButton size="small">{action.icon}</IconButton>
            </Tooltip>
          </MenuItem>
        ))}
      </HorizontalMenu>
    </div>
  );
};

export default ActionMenu;
