// import { useState } from "react";
// import {
//     AppBar,
//     Toolbar,
//     Typography,
//     IconButton,
//     Menu,
//     MenuItem,
//     Button,
//     Box,
//     Divider,
//     Collapse,
//     Drawer,
//   } from "@mui/material";
//   import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import WidgetsIcon from '@mui/icons-material/Widgets';
// import BusinessIcon from '@mui/icons-material/Business';
// import PersonIcon from '@mui/icons-material/Person';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';


// interface MenuItemType {
//     segment?: string;
//     title?: string;
//     icon?: JSX.Element;
//     children?: MenuItemType[];
//     kind?: string;
//     menuOpen: () => void; 
//   }

//   // Define directamente la configuración de navegación
// const NAVIGATION = [
//     // {
//     //   segment: 'MEDSHIP',
//     //   title: 'MEDSHIP',
//     //   icon:  <BusinessIcon sx={{color: '#1B3148'}}/>,
//     //   children: [
//     //     {
//     //       segment: 'Medika Mekanika',
//     //       title: 'Medika Mekanika',
//     //       icon:  <BusinessIcon sx={{color: '#1B3148'}}/>,
//     //     },
//     //     {
//     //       segment: 'Bodega Medika',
//     //       title: 'Bodega Medika',
//     //       icon:  <BusinessIcon sx={{color: '#1B3148'}}/>,
//     //     },
//     //     {
//     //       segment: 'NegoPromos',
//     //       title: 'NegoPromos',
//     //       icon:  <BusinessIcon sx={{color: '#1B3148'}}/>,
//     //     },
//     //   ],
//     // },
//     // {
//     //   kind: 'divider',
//     // },
//     {
//       segment: 'Control del sistema',
//       title: 'Control del sistema',
//       icon:  <WidgetsIcon sx={{color: '#1B3148' }}/>,
//       children: [
//         {
//           segment: 'Control de usuarios',
//           title: 'Control de usuarios',
//           icon: undefined,
//           children: [
//             {
//               segment: 'Usuarios',
//               title: 'Usuarios',
//               icon: <PersonIcon sx={{color: '#1B3148'}}/>,
//             },
//             {
//               segment: 'Plantillas de usuarios',
//               title: 'Plantillas de usuarios',
//               icon: <AdminPanelSettingsIcon sx={{ color: '#1B3148'}}/>,
//             },
//           ],
//         },

//       ],
//     },
//     {
//       segment: 'Opcion 1',
//       title: 'Opcion 1',
//       icon:  <WidgetsIcon sx={{color: '#1B3148' }}/>,
//       children: [
//         {
//           segment: 'SubMenu 1',
//           title: 'SubMenu 1',
//           icon: undefined,
//           children: [
//             {
//               segment: 'SubMenu 1S',
//               title: 'SubMenu 1',
//               icon: undefined,
//             },
//           ],
//         },

//       ],
//     },
//     {
//       segment: 'Opcion 2',
//       title: 'Opcion 2',
//       icon:  <WidgetsIcon sx={{color: '#1B3148' }}/>,
//       children: [
//         {
//           segment: 'SubMenu 2',
//           title: 'SubMenu 2',
//           icon: undefined,
//           children: [
//             {
//               segment: 'SubMenu 2S',
//               title: 'SubMenu 2',
//               icon: undefined,
//             },
//           ],
//         },

//       ],
//     },
//     {
//       segment: 'Opcion N',
//       title: 'Opcion N',
//       icon: <WidgetsIcon sx={{color: '#1B3148' }}/>,
//       children: [
//         {
//           segment: 'SubMenu NS',
//           title: 'SubMenu N',
//           icon: undefined,
//           children: [
//             {
//               segment: 'subMenu N',
//               title: 'SubMenu N',
//               icon: undefined,
//             },
//           ],
//         },

//       ],
//     },
//     {
//       segment: 'Pantalla de inicio',
//       title: 'Pantalla de inicio',
//       icon: <MeetingRoomIcon sx={{color: '#FF5C61'}} />,
//     },
    
//   ];

//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
  

//   const handleToggle = (segment: string) => {
//     setOpenMenus((prevState) => ({
//       ...prevState,
//       [segment]: !prevState[segment],
//     }));
//   };
//   const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

//   const handleTabClick = (segment: string) => {
//     console.log(segment);
//     setSelectedOption(segment); // Actualizar la opción seleccionad
//   };

//   const renderMenuItems = (items: MenuItemType[], level = 0) => {
//     return items.map((item, index) => {
//       if (item.kind === "divider") {
//         return <Divider key={index} sx={{ borderColor: "black", my: 1 }} />;
//       }
  
//       const hasChildren = item.children && item.children.length > 0;
  
//       return (
//         <Box key={`${level}-${index}`} sx={{ pl: (level / 2) * 2 }}>
//           <MenuItem
//             color=""
//             sx={{
//               color: "#1B3148",
//               pl: 0.5,
//               mr: 1,
//               width: "100%", 
//               backgroundColor: selectedOption === item.segment ? "#D3E4F0" : "transparent",
//               "&:hover": {
//                 backgroundColor: selectedOption === item.segment ? "#A0C0D1" : "#F0F0F0",
//                 width: "100%",
//               },
//             }}
//             onClick={() => {
//               handleTabClick(item.segment!);
//               if (hasChildren) handleToggle(item.segment!); // Solo se abre o cierra el submenú correspondiente
//             }}
//           >
//             {item.icon}
//             <Typography sx={{ ml: 0.5, mr:0.5 }}>{item.title}</Typography>
//             {hasChildren && (openMenus[item.segment!] ? <ExpandLess /> : <ExpandMore />)}
//           </MenuItem>
  
//           {hasChildren && (
//             <Collapse in={openMenus[item.segment!]} timeout="auto" unmountOnExit>
//               <Box sx={{ pl: 2 }}>{renderMenuItems(item.children!, level + 1)}</Box>
//             </Collapse>
//           )}
//         </Box>
//       );
//     });
//   };

//   const MenuNavbar: React.FC<MenuItemType> = ({segment, title, icon, children, kind }) => {
//     return(
//         <Drawer
//         anchor="left"
//         open={isSideMenuOpen}
//         onClose={toggleSideMenu}
//         variant="persistent"
//         PaperProps={{
//           sx: {
//             background: "white",
//             height: { xs: "calc(100vh - 64px)", lg: "calc(100vh - 192px)" }, // Ajuste de la altura dependiendo del tamaño de pantalla
//             width: { xs: '100%', lg: '270px' }, // 100% para pantallas pequeñas, 270px para pantallas grandes
//             mt: { xs: "285px", lg: "192px" },
//             boxShadow: 3,
//           },
//         }}
//         BackdropProps={{ invisible: true }}
//       >
//         <Box sx={{ width: 250, p: 2 }}>
//           {renderMenuItems(NAVIGATION)}
//         </Box>
//       </Drawer>
//     );
//   };

//   export default MenuNavbar;