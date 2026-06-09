"use client";

export const breadcrumbRoutes: Record<string, string> = {
    "/home/default": "Inicio",
    "/configuracion": "Inicio > Configuración",
    "/configuracion/configuracion-empresa/informacion-empresa/empresa": "Inicio > Configuración > Configuración de la empresa > Información de la empresa > Empresa",
    "/configuracion/configuracion-sistemas/control-usuarios/usuarios": "Inicio > Configuracion > Configuracion del sistema > Control de usuarios > Usuarios",
    "/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=new": "Inicio > Configuración > Configuración del sistema > Control de usuarios > Usuarios > Crear nuevo usuario",
    "/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=edit": "Inicio > Configuración > Configuración del sistema > Control de usuarios > Usuarios > Editar datos de usuario",
    "/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=view": "Inicio > Configuración > Configuración del sistema > Control de usuarios > Usuarios > Datos generales",
    "/configuracion/configuracion-sistemas/control-usuarios/usuarios/formPermissions?mode=editw":"Inicio > Configuracion > Configuracion del sistema > Control de usuarios > Usuarios > Asignar permisos",
    "/configuracion/configuracion-sistemas/control-usuarios/plantillas":"Inicio > Configuración > Configuracion del sistema > Control de usuarios > Plantillas",
    "/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=new":"Inicio > Configuración > Configuración del sistema > Control de usuarios > Plantillas > Crear plantilla de perfil",
    "/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=view":"Inicio > Configuración > Configuración del sistema > Control de usuarios > Plantillas > Consultar plantilla de perfil",
    "/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=edit":"Inicio > Configuración > Configuración del sistema > Control de usuarios > Plantillas > Editar plantilla de perfil",

    "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa":"Inicio > Configuración > Configuracion del sistema > Catálogos generales > Departamentos de la empresa",
    "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa/form?mode=new":"Inicio > Configuracion > Configuracion del sistema > Catalogos generales > Departamentos de la empresa > Crear nuevo departamento",
    "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa/form?mode=view":"Inicio > Configuración > Configuración del sistema > Catálogos generales > Departamentos de la empresa > Consulta datos del departamento",
    "/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa/form?mode=edit":"Inicio > Configuración > Configuración del sistema > Catálogos generales > Departamentos de la empresa > Editar datos del departamento",
    "/configuracion/configuracion-sistemas/control-usuarios/usuarios-sistema":"Inicio > Configuración > Configuracion del sistema > Control de usuarios > Usuarios dentro del sistema",
    "/configuracion/configuracion-sistemas/control-usuarios/bitacora-empresa":"Inicio > Configuración > Configuracion del sistema > Control de usuarios > Bitácora de la empresa",
    "/configuracion/configuracion-modulos/catalogos-sat":"Inicio > Configuración > Configuración de módulos > Catálogos SAT",
    "/cambiar-contrasenia":"Inicio > Cambiar contraseña",    
    "/datos-perfil":"Inicio > Datos de perfil",
    "/admin/home":"Inicio",
    "/admin/empresas":"Inicio > Empresas",
    "/admin/usuarios":"Inicio > Usuarios",
    "/admin/usuarios/form?mode=new":"Inicio > Usuarios > Crear nuevo usuario",
    "/admin/usuarios/form?mode=view":"Inicio > Usuarios > Datos Generales",
    "/admin/usuarios/form?mode=edit":"Inicio > Usuarios > Editar usuario",
    "/admin/usuarios/formPermissions?mode=editw":"Inicio > Usuarios > Asignar Permisos",
    "/admin/plantillas":"Inicio > Plantillas",    
    "/admin/plantillas/form?mode=new":"Inicio > Plantillas > Crear plantilla de perfil",
    "/admin/plantillas/form?mode=view":"Inicio > Plantillas > Consultar plantilla de perfil",
    "/admin/plantillas/form?mode=edit":"Inicio > Plantillas > Editar plantilla de perfil",
    "/admin/datos-perfil":"Inicio > Datos de perfil",
    "/admin/cambiar-contrasenia":"Inicio > Cambiar contraseña", 

    "/configuracion/configuracion-empresa/informacion-empresa/puestos":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Puestos",
    "/configuracion/configuracion-empresa/informacion-empresa/puestos/form?mode=view":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Puestos > Consultar datos de Puestos",
    "/configuracion/configuracion-empresa/informacion-empresa/puestos/form?mode=edit":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Puestos > Editar dato de Puestos",
    "/configuracion/configuracion-empresa/informacion-empresa/puestos/form?mode=new":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Puestos > Crear nuevo Puesto",    
    "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Áreas/Secciones",
    "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/form?mode=new":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Áreas/Secciones > Crear una nueva Área/Sección",
    "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/form?mode=view":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Áreas/Secciones > Consulta de datos de Área/Sección",
    "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/form?mode=edit":"Inicio > Configuración > Configuración de la empresa > Información de la empresa > Áreas/Secciones > Editar datos de Área/Sección",
    "/configuracion/configuracion-empresa/informacion-empresa/sucursales":"Inicio > Configuración > Configuracion de la empresa > Información de la empresa > Sucursales",
    "/configuracion/configuracion-empresa/informacion-empresa/sucursales/form?mode=new":"Inicio > Configuración > Configuracion de la empresa > Información de la empresa > Sucursales > Agregar sucursal",
    //TODO: Corregir por la ruta correcta
    "/configuracion/configuracion-empresa/informacion-empresa/sucursales/undefined/documentacion":"Inicio > Configuración > Configuracion de la empresa > Información de la empresa > Sucursales > Documentación adicional",
    "/configuracion/configuracion-empresa/informacion-empresa/sucursales/form?mode=view":"Inicio > Configuración > Configuracion de la empresa > Información de la empresa > Sucursales > Consultar sucursal",
    "/configuracion/configuracion-empresa/informacion-empresa/sucursales/form?mode=edit":"Inicio > Configuración > Configuracion de la empresa > Información de la empresa > Sucursales > Editar sucursal",
    
    "/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Clasificación de clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes/form?mode=new":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Clasificación de clientes > Crear nueva Clasificación de Clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes/form?mode=view":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Clasificación de clientes > Consulta de datos de Clasificación de Clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Clasificación de clientes > Editar datos de Clasificación de Clientes",

    "/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Subclasificación de clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/form?mode=new":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Subclasificación de clientes > Crear nueva Subclasificación de Clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/form?mode=view":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Subclasificación de clientes > Consulta de datos de Subclasificación de Clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Subclasificación de clientes > Editar datos de Subclasificación de Clientes",

    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de cancelación",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/form?mode=new":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de cancelación > Crear nuevo concepto de cancelación",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/form?mode=view":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de cancelación > Consulta de datos de concepto de cancelación",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de cancelación > Editar datos de concepto de cancelación",

    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de devolución",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion/form?mode=new":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de devolución > Crear nuevo concepto de devolución",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion/form?mode=view":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de devolución > Consultar datos de concepto de devolución",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Conceptos de devolución > Editar dato de concepto de devolución",
    
    "/configuracion/configuracion-modulos/almacenes/catalogos/estatus-de-producto":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Estatus de producto",
    "/configuracion/configuracion-modulos/almacenes/catalogos/estatus-de-producto/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Estatus de producto > Crear nuevo Estatus de Producto",
    "/configuracion/configuracion-modulos/almacenes/catalogos/estatus-de-producto/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Estatus de producto > Consulta de datos de Estatus del Producto",
    "/configuracion/configuracion-modulos/almacenes/catalogos/estatus-de-producto/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Estatus de producto > Editar datos de Estatus del Producto",

    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones":"Inicio > Configuración > Configuración de módulos > General > Catálogos > Conceptos de restricciones",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones/form?mode=new":"Inicio > Configuración > Configuración de módulos > General > Catálogos > Conceptos de restricciones > Crear nuevo Concepto de restricción",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones/form?mode=view":"Inicio > Configuración > Configuración de módulos > General > Catálogos > Conceptos de restricciones > Consulta de dato de Concepto de restricción",
    "/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones/form?mode=edit":"Inicio > Configuración > Configuración de módulos > General > Catálogos > Conceptos de restricciones > Editar dato de Concepto de restricción",

    "/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Presentaciones",
    "/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Presentaciones > Crear nueva Presentación",
    "/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Presentaciones > Consulta de datos de Presentación",
    "/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Presentaciones > Editar dato de Presentación",

    "/configuracion/configuracion-modulos/almacenes/catalogos/empaques":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Empaques",
    "/configuracion/configuracion-modulos/almacenes/catalogos/empaques/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Empaques > Crear nuevo Empaque",
    "/configuracion/configuracion-modulos/almacenes/catalogos/empaques/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Empaques > Consulta de datos de Empaque",
    "/configuracion/configuracion-modulos/almacenes/catalogos/empaques/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Empaques > Editar datos de Empaque",

    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-clientes":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-clientes/form?mode=new":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de clientes > Crear nuevo Tipo de cliente",
    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-clientes/form?mode=view":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de clientes > Consulta de datos de Tipo de Clientes",
    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-clientes/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de clientes > Editar dato de Tipo de clientes",

    "/configuracion/configuracion-modulos/almacenes/catalogos/marcas":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Marcas",
    "/configuracion/configuracion-modulos/almacenes/catalogos/marcas/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Marcas > Crear nueva Marca",
    "/configuracion/configuracion-modulos/almacenes/catalogos/marcas/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Marcas > Consultar datos de Marca",
    "/configuracion/configuracion-modulos/almacenes/catalogos/marcas/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Marcas > Editar datos de Marca",

    "/configuracion/configuracion-modulos/generales/catalogos":"Inicio > Configuracion > Configuracion de módulos > Generales > Catálogos ",

    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-vendedores":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de Vendedor",
    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-vendedores/form?mode=new":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de Vendedor > Crear nuevo Tipo de Vendedor",
    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-vendedores/form?mode=view":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de Vendedor > Consulta de datos de Tipo de Vendedor",
    "/configuracion/configuracion-modulos/ventas/catalogos/tipos-vendedores/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Tipos de Vendedor > Editar dato de Tipo de Vendedor",

    "/configuracion/configuracion-sistemas/configuracion-claves":"Inicio > Configuración > Configuración del sistema > Definición de claves de catálogos",
    "/configuracion/configuracion-sistemas/configuracion-claves/form?mode=new":"Inicio > Configuración > Configuración del sistema > Definición de claves de catálogos > Crear nueva Definición de claves de catálogos",
    "/configuracion/configuracion-sistemas/configuracion-claves/form?mode=view":"Inicio > Configuración > Configuración del sistema > Definición de claves de catálogos > Consultar datos de Definición de claves de catálogos",
    "/configuracion/configuracion-sistemas/configuracion-claves/form?mode=edit":"Inicio > Configuración > Configuración del sistema > Definición de claves de catálogos > Editar datos de Definición de claves de catálogos",

    "/configuracion/configuracion-modulos/generales/catalogos/zonas":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Zonas",
    "/configuracion/configuracion-modulos/generales/catalogos/zonas/form?mode=new":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Zonas > Crear nueva Zona",
    "/configuracion/configuracion-modulos/generales/catalogos/zonas/form?mode=view":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Zonas > Consulta de datos de Zona",
    "/configuracion/configuracion-modulos/generales/catalogos/zonas/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > Zonas > Editar dato de Zona",

    "/configuracion/configuracion-modulos/generales/catalogos/sub-zonas":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > SubZonas",
    "/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/form?mode=new":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > SubZonas > Crear nueva SubZona",
    "/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/form?mode=view":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > SubZonas > Consultar datos de SubZona",
    "/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Generales > Catálogos > SubZonas > Editar datos de SubZona",


    "/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Fabricantes",
    "/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Fabricantes > Crear nuevo Fabricante",
    "/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Fabricantes > Consultar dato de Fabricante",
    "/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Fabricantes > Editar dato de Fabricante",

    "/configuracion/configuracion-modulos/almacenes/catalogos/categorias":"Inicio > Configuración > Configuración de módulos > Almacen > Catálogos > Categorías",
    "/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacen > Catálogos > Categorías > Crear nueva categorías",
    "/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacen > Catálogos > Categorías > Consultar categorías",
    "/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacen > Catálogos > Categorías > Editar categorías",
    "/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=newsubcat":"Inicio > Configuración > Configuración de módulos > Almacen > Catálogos > Categorías > Crear nueva subcategoria",
    "/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=editsubcat":"Inicio > Configuración > Configuración de módulos > Almacen > Catálogos > Categorías > Editar subcategoria",
    "/configuracion/configuracion-modulos/almacenes/catalogos/categorias/form?mode=viewsubcat":"Inicio > Configuración > Configuración de módulos > Almacen > Catálogos > Categorías > Consultar subcategoria",


    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos",
    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos > Crear nuevo Atributo",
    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos > Consultar datos de Atributo",
    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos > Editar datos de Atributo",

    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos/[atributoId]/valores": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos > Valores del Atributo",
    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos/[atributoId]/valores/form?mode=new": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos > Valores del Atributo > Crear valor del atributo",
    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos/[atributoId]/valores/form?mode=view": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos > Valores del Atributo > Consultar valor del Atributo",
    "/configuracion/configuracion-modulos/almacenes/catalogos/atributos/[atributoId]/valores/form?mode=edit": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Atributos > Valores del Atributo > Editar valor del Atributo",

    "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Conceptos de movimientos de inventario",
    "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario/form?mode=new": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Conceptos de movimientos de inventario > Crear nuevo concepto de movimiento de inventario",
    "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario/form?mode=view": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Conceptos de movimientos de inventario > Consultar datos de concepto de movimiento de inventario",
    "/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario/form?mode=edit": "Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Conceptos de movimientos de inventario > Editar datos de concepto de movimiento de inventario",

    "/configuracion/configuracion-modulos/ventas/catalogos/vendedores":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Vendedores",
    "/configuracion/configuracion-modulos/ventas/catalogos/vendedores/form?mode=new":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Vendedores > Crear nuevo Vendedor",
    "/configuracion/configuracion-modulos/ventas/catalogos/vendedores/form?mode=view":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Vendedores > Consultar datos del Vendedor",
    "/configuracion/configuracion-modulos/ventas/catalogos/vendedores/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Ventas > Catálogos > Vendedores > Editar datos del Vendedor",

    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por cobrar",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc/form?mode=new":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por cobrar > Crear nuevo tipo de documento",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc/form?mode=view":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por cobrar > Consultar tipo de documento",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por cobrar > Editar tipo de documento",

    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxp":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por pagar",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxp/form?mode=new":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por pagar > Crear nuevo tipo de documento",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxp/form?mode=view":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por pagar > Consultar tipo de documento",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxp/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de documentos cuentas por pagar > Editar tipo de documento",

    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones bancarias",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias/form?mode=new":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones bancarias > Crear nuevo concepto de transacción bancaria",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias/form?mode=view":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones bancarias > Consultar dato de concepto de transacción bancaria",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones bancarias > Editar dato de concepto de transacción bancaria",

    "/configuracion/configuracion-sistemas/control-usuarios/colaboradores":"Inicio > Configuración > Configuración de sistema > Usuarios > Colaboradores",
    "/configuracion/configuracion-sistemas/control-usuarios/colaboradores/form?mode=new":"Inicio > Configuración > Configuración de sistema > Usuarios > Colaboradores > Crear nuevo colaborador",
    "/configuracion/configuracion-sistemas/control-usuarios/colaboradores/form?mode=view":"Inicio > Configuración > Configuración de sistema > Usuarios > Colaboradores > Consultar dato del colaborador",
    "/configuracion/configuracion-sistemas/control-usuarios/colaboradores/form?mode=edit":"Inicio > Configuración > Configuración de sistema > Usuarios > Colaboradores > Editar dato del colaborador",

    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por cobrar",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc/form?mode=new":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por cobrar > Crear nuevo concepto CXC",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc/form?mode=view":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por cobrar > Consultar dato de concepto CXC",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por cobrar > Editar dato de concepto CXC",

    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxp":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por pagar",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxp/form?mode=new":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por pagar > Crear nuevo concepto transacción CXP",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxp/form?mode=view":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por pagar > Consultar dato de concepto transacción CXP",
    "/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxp/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Conceptos de transacciones a cuentas por pagar > Editar dato de concepto transacción CXP",

    "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Cuentas bancarias",
    "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias/form?mode=new":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Cuentas bancarias > Crear nueva cuenta bancaria",
    "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias/form?mode=view":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Cuentas bancarias > Consultar dato de cuenta bancaria",
    "/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Cuentas bancarias > Editar dato de cuenta bancaria",

    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenes",
    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenes > Crear nuevo tipo de almacen",
    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenes > Consultar dato de tipo de almacen",
    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenes > Editar dato de tipo de almacen",
    
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-contratos-bancarios":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Tipos de contratos bancarios",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-contratos-bancarios/form?mode=new":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Crear nuevo tipo de contrato bancario",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-contratos-bancarios/form?mode=view":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Consultar dato de tipos de contrato bancario",
    "/configuracion/configuracion-modulos/finanzas/catalogos/tipos-contratos-bancarios/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Finanzas > Catálogos > Editar dato de tipo de contrato bancario",

    "/configuracion/configuracion-modulos/generales/catalogos/monedas":"Inicio > Configuración > Configuración de módulos > General > Cátalogo > Monedas",
    "/configuracion/configuracion-modulos/generales/catalogos/monedas/form?mode=new":"Inicio > Configuración > Configuración de módulos > General > Cátalogo > Monedas > Crear nueva moneda",
    "/configuracion/configuracion-modulos/generales/catalogos/monedas/form?mode=view":"Inicio > Configuración > Configuración de módulos > General > Cátalogo > Monedas > Consultar dato de moneda",
    "/configuracion/configuracion-modulos/generales/catalogos/monedas/form?mode=edit":"Inicio > Configuración > Configuración de módulos > General > Cátalogo > Monedas > Editar dato de moneda",

    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenajes",
    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje/form?mode=new":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenes > Crear nuevo tipo de almacenaje",
    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje/form?mode=view":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenes > Consultar tipo de almacenaje",
    "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje/form?mode=edit":"Inicio > Configuración > Configuración de módulos > Almacenes > Catálogos > Tipos de almacenes > Editar tipo de almacenaje",
    
};
  