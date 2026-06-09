// components/UserMenu.tsx
import { Menu, MenuItem } from "@mui/material";
import Link from "next/link";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  menuItems: { label: string; href?: string; action?: () => void }[];
}

const UserMenu = ({ anchorEl, onClose, menuItems }: UserMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={item.action ? item.action : undefined}
        >
          {item.href ? (
            <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default UserMenu;
