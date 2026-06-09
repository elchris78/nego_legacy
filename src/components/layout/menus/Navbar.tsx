// import React, { useState } from 'react'
// import { Button } from "@/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/ui/dropdown-menu"
// import Image from 'next/image'
// import Link from 'next/link'
// import avatar from '@/Asset/Almacenes.png'
// import { Menu, X } from 'lucide-react'

// interface NavbarProps {
//   Titulo: string;
// }

// const Navbar: React.FC<NavbarProps> = ({Titulo}) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

//   const navItems = [
//     { name: 'Inicio', href: '/', dropdown: false },
//     { name: 'Almacen', href: '#', dropdown: true, items: [
//       { name: 'Empresas', href: '/configuracion/Empresas' },
//       { name: 'Plantillas de perfiles', href: '/configuracion/Plantillas_Perfiles' },
//       { name: 'Usuarios Compartidos', href: '/configuracion/Usuarios_Comprartidos' },
//     ]},
//     { name: 'Ventas', href: '#', dropdown: true, items: [
//       { name: 'Empresas', href: '/configuracion/Empresas' },
//       { name: 'Plantillas de perfiles', href: '/configuracion/Plantillas_Perfiles' },
//       { name: 'Usuarios Compartidos', href: '/configuracion/Usuarios_Comprartidos' },
//     ]},
//     { name: 'Finanzas', href: '#', dropdown: true, items: [
//       { name: 'Empresas', href: '/configuracion/Empresas' },
//       { name: 'Plantillas de perfiles', href: '/configuracion/Plantillas_Perfiles' },
//       { name: 'Usuarios Compartidos', href: '/configuracion/Usuarios_Comprartidos' },
//     ]},
//     { name: 'Compras', href: '#', dropdown: true, items: [
//       { name: 'Empresas', href: '/configuracion/Empresas' },
//       { name: 'Plantillas de perfiles', href: '/configuracion/Plantillas_Perfiles' },
//       { name: 'Usuarios Compartidos', href: '/configuracion/Usuarios_Comprartidos' },
//     ]},
//     { name: 'Distribución', href: '#', dropdown: true, items: [
//       { name: 'Empresas', href: '/configuracion/Empresas' },
//       { name: 'Plantillas de perfiles', href: '/configuracion/Plantillas_Perfiles' },
//       { name: 'Usuarios Compartidos', href: '/configuracion/Usuarios_Comprartidos' },
//     ]},
//     { name: 'Configuración', href: '#', dropdown: true, items: [
//       { name: 'Empresas', href: '/configuracion/Empresas' },
//       { name: 'Plantillas de perfiles', href: '/configuracion/Plantillas_Perfiles' },
//       { name: 'Usuarios Compartidos', href: '/configuracion/Usuarios_Comprartidos' },
//     ]},
//   ]

//   return (
//     <div className=" p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="flex items-center">
//           <Image
//             src={avatar}
//             alt="Logo de la empresa"
//             width={40}
//             height={40}
//             className="mr-4"
//           />
//         </div>
//         <h1 className="text-2xl font-bold text-center flex-grow md:flex-grow-0">{Titulo}</h1>
//         <nav className="hidden md:block">
//           <ul className="flex space-x-4">
//             {navItems.map((item, index) => (
//               <li key={index}>
//                 {item.dropdown ? (
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="link" className="text-primary-foreground p-0">
//                         {item.name}
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       {item.items.map((subItem, subIndex) => (
//                         <DropdownMenuItem key={subIndex}>
//                           <Link href={subItem.href}>{subItem.name}</Link>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <Button variant="link" className="text-primary-foreground p-0">
//                     <Link href={item.href}>{item.name}</Link>
//                   </Button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
//         <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
//           {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//         </Button>
//       </div>
//       {isMenuOpen && (
//         <nav className="md:hidden mt-4">
//           <ul className="space-y-2">
//             {navItems.map((item, index) => (
//               <li key={index}>
//                 {item.dropdown ? (
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="link" className="text-primary-foreground p-0 w-full text-left">
//                         {item.name}
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       {item.items.map((subItem, subIndex) => (
//                         <DropdownMenuItem key={subIndex}>
//                           <Link href={subItem.href}>{subItem.name}</Link>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <Button variant="link" className="text-primary-foreground p-0 w-full text-left">
//                     <Link href={item.href}>{item.name}</Link>
//                   </Button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
//       )}
//     </div>
//   )
// }

// export default Navbar