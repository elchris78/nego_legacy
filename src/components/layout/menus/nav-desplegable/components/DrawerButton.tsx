import Image from 'next/image';
import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import { MenuItemType } from "./types";
import { MenuItemIconComponent} from "./MenuItemIconComponent";
import menuDrawer  from "@/assets/menuDrawer.png"

interface DrawerContentProps {
  navigation: MenuItemType[];
  openMenus: { [key: string]: boolean };
  onToggle: (segment: string) => void;
  userType: string | null;
  companyCount: number | null;
  companiesMenu: any[];
  onMenuToggle: () => void;
}

const DrawerContent = ( {
  navigation,
  openMenus,
  onToggle,
  userType,
  companyCount,
  companiesMenu,
  onMenuToggle,
}: DrawerContentProps ) => {

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const renderMenuItems = (items: MenuItemType[], level = 0) => {
    return items.map((item, index) => (
      <MenuItemIconComponent
        key={`${level}-${item.segment}-${index}`}
        item={item}
        onToggle={onToggle}
        level={level}
        openMenus={openMenus}
      >
        {item.children && item.children.length > 0 && openMenus[item.segment!] && (
          <Box sx={{ px: level > 0 ? 0 : 1}}>{renderMenuItems(item.children, level + 1)}</Box>
        )}
      </MenuItemIconComponent>
    ));
  };

  return (
    <Box sx={{ display: 'flex', width: "60px",  maxHeight: "calc(100% - 50px)", overflow: 'hidden', mt: 2, }}>
      <Box sx={{ 
        flexGrow: 1,
        transition: 'margin-left 0.3s ease-in-out',
        marginLeft: isMenuOpen ? 0 : 'calc(-100% + 60px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
      }}>
        <Box
          sx={{ 
            display: "flex", 
            justifyContent: "flex-start" ,
            ml: 1.5
          }}
        >  
          <Button onClick={onMenuToggle} sx={{ color: "white", minWidth: 'auto', mt: 0 }}>
            <Image
              src={menuDrawer}
              alt="Cerrar menú"
              style={{
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s',
                width: '19px',
                height: '29px',
              }}
            />
          </Button>
        </Box>
        <Box sx={{ pt: 1 }}>
          {renderMenuItems(navigation)}
        </Box>
      </Box>

    </Box>
  );
};

export default DrawerContent;

