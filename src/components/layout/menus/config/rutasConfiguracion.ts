import configSistema from '@/assets/configSistemas.svg';
import configEmp from '@/assets/ConfigEmp.png';
import satIcon from '@/assets/SATMIcon.png';
import controlUsuarios from '@/assets/controlU.png';
import catGenerales from '@/assets/catGeneral.png';
import cancelacion from '@/assets/cancelacion.png';
import configM from '@/assets/configM.png';
import configS from '@/assets/configS1.png';
import { Segment } from '@mui/icons-material';
import { se, sr } from 'date-fns/locale';
import { title } from 'process';


export const NAVIGATION = [
    {
      segment: 'Configuración de la empresa',
      title: 'Configuración de la empresa',
      icon:  configEmp,
      claimValue: "Configuración.Configuración empresa.Leer",
      children:[
        {
          segment: 'Información de la empresa',
          title: 'Información de la empresa',
          icon: "",
          claimValue: 'Configuración.Configuración empresa.Información de la empresa.Leer',
          children:[
            {
              segment: 'Empresa',
              title: 'Empresa',
              icon: "",
              src: '/configuracion/configuracion-empresa/informacion-empresa/empresa',
              claimValue:'Configuración.Configuración empresa.Información de la empresa.Empresa.Actualizar'
            },
            {
              segment: 'Sucursales',
              title: 'Sucursales',
              icon: "",
              src: '/configuracion/configuracion-empresa/informacion-empresa/sucursales',
              claimValue:'Configuración.Configuración empresa.Información de la empresa.Sucursales.Leer'
            },
            {
              segment: 'Áreas/Secciones',
              title: 'Áreas/Secciones',
              icon: "",
              src: '/configuracion/configuracion-empresa/informacion-empresa/areas-secciones',
              claimValue:'Configuración.Configuración empresa.Información de la empresa.Áreas / Secciones.Leer'
            },
            {
              segment: 'Departamentos',
              title: 'Departamentos',
              icon: "",
              src: '/configuracion/configuracion-sistemas/catalogos-generales/departamentos-empresa',
              claimValue: "Configuración.Configuración empresa.Información de la empresa.Departamentos.Leer",
            },
            {
              segment: 'Puestos',
              title: 'Puestos',
              icon: "",
              src: '/configuracion/configuracion-empresa/informacion-empresa/puestos',
              claimValue:'Configuración.Configuración empresa.Información de la empresa.Puestos.Leer'
            },
          ]
        },
        {
          segment: 'Parametros generales',
          title: 'Parametros generales',
          icon: "",
          claimValue:'Configuración.Configuración empresa.Parámetros generales.Leer',
          children:[
            {
              segment: 'Definición de folios',
              title: 'Definición de folios',
              icon: "",
              src: '/configuracion/configuracion-empresa/parametros-generales/definicion-folios',
              claimValue:'Configuración.Configuración empresa.Parámetros generales.Definición de folios.Leer'
            },
            {
              segment: 'Definición de decimales',
              title: 'Definición de decimales',
              icon: "",
              src: '/configuracion/configuracion-empresa/parametros-generales/definicion-decimales',
              claimValue:'Configuración.Configuración empresa.Parámetros generales.Definición de decimales.Leer'
            },
            {
              segment: 'Impuestos',
              title: 'Impuestos',
              icon: "",
              src: '/configuracion/configuracion-empresa/parametros-generales/impuestos',
              claimValue:'Configuración.Configuración empresa.Parámetros generales.Impuestos.Leer'
            },
            {
              segment: 'Tipo de monedas',
              title: 'Tipo de monedas',
              icon: "",
              src: '/configuracion/configuracion-empresa/parametros-generales/tipo-monedas',
              claimValue:'Configuración.Configuración empresa.Parámetros generales.Tipo de monedas.Leer'
            },
            {
              segment: 'Encabezado y Pie de página',
              title: 'Encabezado y Pie de página',
              icon: "",
              src: '/configuracion/configuracion-empresa/parametros-generales/encabezado-pie',
              claimValue:'Configuración.Configuración empresa.Parámetros generales.Encabezado y pie de página.Leer'
            }
          ]
        },
        {
          segment: 'Formatos predeterminados',
          title: 'Formatos predeterminados',
          icon: "",
          src: '/configuracion/configuracion-empresa/formatos-predeterminados',
          claimValue:'Configuración.Configuración empresa.Formatos predeterminados.Leer'
        }
      ],
      // claimValue: "Configuracion.Empresa.Leer",
    },// source--------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------    
    {
      segment: 'Configuración del sistema',
      title: 'Configuración del sistema',
      icon:  configS,
      claimValue:"Configuración.Configuración del sistema.Leer",
      children: [
        {
          segment: 'Usuarios',
          title: 'Usuarios',
          icon: controlUsuarios,
          claimValue: 'Configuración.Configuración del sistema.Usuarios.Leer',
          children: [
            {
              segment: 'Usuarios',
              title: 'Usuarios',
              icon: "",
              src: '/configuracion/configuracion-sistemas/control-usuarios/usuarios',
              claimValue: "Configuración.Configuración del sistema.Usuarios.Usuario.Leer",
              createOption: true,
              createSrc: "/configuracion/configuracion-sistemas/control-usuarios/usuarios/formUser?mode=new",
            },// source----------------------------------------------------------------------------------------------------------------
            {
              segment: 'Plantillas de perfiles',
              title: 'Plantillas de perfiles',
              icon: "",
              src: '/configuracion/configuracion-sistemas/control-usuarios/plantillas',
              claimValue: "Configuración.Configuración del sistema.Usuarios.Plantillas de perfiles.Leer",
              createOption: true,
              createSrc: "/configuracion/configuracion-sistemas/control-usuarios/plantillas/form?mode=new",
            },// source----------------------------------------------------------------------------------------------------------------
            {
              segment: 'Acciones y autorizaciones',
              title: 'Acciones y autorizaciones',
              icon: undefined,
              src: '',
              claimValue: "Configuración.Configuración del sistema.Usuarios.Acciones y autorizaciones.Leer"
            },// source----------------------------------------------------------------------------------------------------------------
            {
              segment: 'Colaboradores',
              title: 'Colaboradores',
              icon: undefined,
              src: '/configuracion/configuracion-sistemas/control-usuarios/colaboradores',
              claimValue: "Configuración.Configuración del sistema.Usuarios.Colaboradores.Leer",
              createOption: true,
            },// source----------------------------------------------------------------------------------------------------------------
          ],
        },
        {
          segment: 'Politicas del sistema',
          title: 'Politicas del sistema',
          icon: "",
          src: '/configuracion/configuracion-sistemas/politicas-sistema',
          claimValue: "Configuración.Configuración del sistema.Políticas del sistema.Leer"
        },
        {
          segment: 'Definición de claves de catálogos',
          title: 'Definición de claves de catálogos',
          icon: '',
          src: '/configuracion/configuracion-sistemas/configuracion-claves',
          claimValue: 'Configuración.Configuración del sistema.Definición de claves de catálogos.Leer'
        },
        {
          segment: 'Diseño de formatos y etiquetas',
          title: 'Diseño de formatos y etiquetas',
          icon: "",
          claimValue:'Configuración.Configuración del sistema.Diseño de formatos y etiquetas.Leer',
          children: [
            {
              segment: 'Formatos',
              title: 'Formatos',
              icon: "",
              src: '/configuracion/configuracion-sistemas/formatos-etiquetas/formatos',
              claimValue:'Configuración.Configuración del sistema.Diseño de formatos y etiquetas.Formatos.Leer',
            },
            {
              segment: 'Etiquetas',
              title: 'Etiquetas',
              icon: "",
              src: '/configuracion/configuracion-sistemas/formatos-etiquetas/etiquetas',
              claimValue:'Configuración.Configuración del sistema.Diseño de formatos y etiquetas.Etiquetas.Leer',
            }
          ]
        },
        {
          segment: 'Utilerías',
          title: 'Utilerías',
          icon: "",
          claimValue:'Configuración.Configuración del sistema.Utilerías.Leer',
          children: [
            {
              segment: 'Usuarios dentro del sistema',
              title: 'Usuarios dentro del sistema',
              icon: "",
              src: '/configuracion/configuracion-sistemas/control-usuarios/usuarios-sistema',
              claimValue: "Configuración.Configuración del sistema.Utilerías.Usuarios en el sistema.Leer"
            },// source----------------------------------------------------------------------------------------------------------------   
            {
              segment: 'Bitácora de la empresa',
              title: 'Bitácora de la empresa',
              icon: "",
              src: '/configuracion/configuracion-sistemas/control-usuarios/bitacora-empresa',
              claimValue: "Configuración.Configuración del sistema.Utilerías.Bitácora del sistema.Leer"
            },
            {
              segment: 'Inclusión  de otros datos',
              title: 'Inclusión  de otros datos',
              icon: "",
              src: '/configuracion/configuracion-sistemas/utilerias/inclusion-datos',
              claimValue:'Configuración.Configuración del sistema.Utilerías.Inclusión de otros datos.Leer'
            },
            {
              segment: 'Carga inicial de documentos',
              title: 'Carga inicial de documentos',
              icon: "",
              src: '/configuracion/configuracion-sistemas/utilerias/carga-documentos',
              claimValue:'Configuración.Configuración del sistema.Utilerías.Carga inicial de documentos.Leer'
            },
            {
              segment: 'Tablero de Bienvenida inicial',
              title: 'Tablero de Bienvenida inicial',
              icon: "",
              src: '/configuracion/configuracion-sistemas/utilerias/tablero-bienvenida',
              claimValue:'Configuración.Configuración del sistema.Utilerías.Tablero de Bienvenida inicial.Leer'
            }
          ]
        },
        {
          segment: 'TI',
          title: 'TI',
          icon: "",
          claimValue:'Configuración.Configuración del sistema.TI.Leer',
          children: [
            {
              segment: ' Soporte técnico',
              title: 'Soporte técnico',
              icon: "",
              src: '/configuracion/configuracion-sistemas/ti/soporte-tecnico',
              claimValue:'Configuración.Configuración del sistema.TI.Soporte técnico.Leer'
            },
            {
              segment: 'Avisos',
              title: 'Avisos',
              icon: "",
              src: '/configuracion/configuracion-sistemas/ti/avisos',
              claimValue:'Configuración.Configuración del sistema.TI.Avisos.Leer'
            },
            {
              segment: 'Respaldos',
              title: 'Respaldos',
              icon: "",
              src: '/configuracion/configuracion-sistemas/ti/respaldos',
              claimValue:'Configuración.Configuración del sistema.TI.Respaldos.Leer'
            }
          ]
        },
        {
          segment: 'Manual del sistema',
          title: 'Manual del sistema',
          icon: "",
          src: '/configuracion/configuracion-sistemas/manual-sistema',
          claimValue:'Configuración.Configuración del sistema.Manual del sistema.Leer'
        },
        {
          segment: 'Información del sistema',
          title: 'Información del sistema',
          icon: "",
          src: '/configuracion/configuracion-sistemas/informacion-empresa',
          claimValue:'Configuración.Configuración del sistema.Información del sistema.Leer'
        },
      ],
    },
// --------------------------------------------------------------------------------------------------------------------------------
    {
      segment: 'Configuración de modulos',
      title: 'Configuración de modulos',
      claimValue: 'Configuración.Configuración de módulos.Leer',
      icon:  configM,
      children: [
        {
          segment: 'Generales',
          title: 'Generales',
          icon: '',
          claimValue:'Configuración.Configuración de módulos.Generales.Leer',
          children: [
            {
              segment: 'Catálogos generales',
              title: 'Catálogos',
              icon: '',
              src:'/configuracion/configuracion-modulos/generales/catalogos',
              claimValue:'Configuración.Configuración de módulos.Generales.Catálogos.Leer'
            },
            {
              segment: 'Catálogos SAT',
              title: 'Catálogos SAT',
              icon: "",
              src: '/configuracion/configuracion-modulos/catalogos-sat',
              claimValue: "Configuración.Configuración de módulos.Catálogos SAT.Leer",
            },
          ]
        },
        {
          segment: 'Almacenes',
          title: 'Almacenes',
          icon: '',
          claimValue:'Configuración.Configuración de módulos.Almacenes.Leer',
          children: [
            {
              segment: 'Catálogos almacenes',
              title: 'Catálogos',
              icon: '',
              claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Leer',
              children: [
                {
                  segment: 'Almacenes',
                  title: 'Almacenes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/generales/almacenes/catalogos/almacenes',
                },
                {
                  segment: 'Tipo de almacenes',
                  title: 'Tipo de almacenes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes',
                  claimValue: 'Configuración.Configuración de módulos.Almacenes.Catálogos.Tipo de almacén.Leer'
                },
                {
                  segment: 'Ubicaciones',
                  title: 'Ubicaciones',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/generales/almacenes/catalogos/ubicaciones',
                },
                {
                  segment: 'Marcas',
                  title: 'Marcas',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/marcas',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Marcas.Leer'
                },
                {
                  segment: 'Categorias',
                  title: 'Categorias',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/categorias',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Categorías.Leer'
                },
                {
                  segment: 'Empaques',
                  title: 'Empaques',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/empaques',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Empaques.Leer'
                },
                {
                  segment: 'Estatus productos',
                  title: 'Estatus productos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/estatus-de-producto',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Estatus producto.Leer'
                },
                {
                  segment: 'Fabricantes',
                  title: 'Fabricantes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Fabricantes.Leer'
                },
                {
                  segment: 'Presentaciones',
                  title: 'Presentaciones',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Presentaciones.Leer'
                },
                {
                  segment: 'Etiquetas',
                  title: 'Etiquetas',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/generales/almacenes/catalogos/etiquetas',
                },
                {
                  segment: 'Atributos',
                  title: 'Atributos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/atributos',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Atributos.Leer'
                },
                {
                  segment: 'Tipos de traspasos',
                  title: 'Tipos de traspasos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/generales/almacenes/catalogos/tipos-traspasos',
                },
                {
                  segment: 'Conceptos de movimientos al inventario',
                  title: 'Conceptos de movimientos al inventario',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Conceptos de movimientos al inventario.Leer'
                },
                {
                  segment: 'Tipos de almacenaje',
                  title: 'Tipos de almacenaje',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje',
                  claimValue:'Configuración.Configuración de módulos.Almacenes.Catálogos.Tipos de almacenaje.Leer'
                },
                // {
                //   segment: 'Conceptos de restricciones de venta',
                //   title: 'Conceptos de restricciones de venta',
                //   icon: '',
                //   src: '/configuracion/configuracion-modulos/generales/almacenes/catalogos/conceptos-restricciones',
                //   // claimValue:''
                // }
              ]
            },
            {
              segment: 'Diseño de tableros y reportes almacenes',
              title: 'Diseño de tableros y reportes',
              icon: '',
              children: [
                {
                  segment: 'Tablero inicial (Dashboard)',
                  title: 'Tablero inicial (Dashboard)',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/generales/almacenes/tablero-inicial',
                },
                {
                  segment: 'Plantillas reporte',
                  title: 'Plantillas reporte',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/generales/almacenes/plantillas-reporte',
                }
              ]
            },
          ]
        },
        {
          segment: 'Compras',
          title: 'Compras',
          icon: '',
          claimValue:'Configuración.Configuración de módulos.Compras.Leer',
          children: [
            {
              segment: 'Catálogos compras',
              title: 'Catálogos',
              icon: '',
              children: [
                {
                  segment: 'Gastos adicionales',
                  title: 'Gastos adicionales',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/compras/catalogos/gastos-adicionales',
                },
              ]
            },
            {
              segment: 'Diseño de tableros y reportes compras',
              title: 'Diseño de tableros y reportes',
              icon: '',
              children: [
                {
                  segment: 'Tablero inicial (Dashboard)',
                  title: 'Tablero inicial (Dashboard)',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/compras/tablero-inicial',
                },
                {
                  segment: 'Plantillas reporte',
                  title: 'Plantillas reporte',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/compras/plantillas-reporte',
                }
              ]
            }
          ]
        },
        {
          segemnt: 'Ventas',
          title: 'Ventas',
          icon: '',
          claimValue:'Configuración.Configuración de módulos.Ventas.Leer',
          children: [
            {
              segment: 'Catálogos ventas',
              title: 'Catálogos',
              icon: '',
              children: [
                {
                  segment: 'Clasificación de clientes',
                  title: 'Clasificación de clientes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes',
                  claimValue: 'Configuración.Configuración de módulos.Ventas.Catálogos.Clasificación de clientes.Leer'
                },
                {
                  segment: 'Subclasificación de clientes',
                  title: 'Subclasificación de clientes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes',
                  claimValue:'Configuración.Configuración de módulos.Ventas.Catálogos.Subclasificación de clientes.Leer'
                },
                {
                  segment: 'Grupos de clientes',
                  title: 'Grupos de clientes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/catalogos/grupos-clientes',
                },
                {
                  segment: 'Tipos de clientes',
                  title: 'Tipos de clientes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/catalogos/tipos-clientes',
                  claimValue:'Configuración.Configuración de módulos.Ventas.Catálogos.Tipos de clientes.Leer'
                },
                {
                  segment: 'Tipos de vendedor',
                  title: 'Tipos de vendedor',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/catalogos/tipos-vendedores',
                  claimValue:'Configuración.Configuración de módulos.Ventas.Catálogos.Tipos de vendedores.Leer'
                },
                {
                  segment: 'Vendedores',
                  title: 'Vendedores',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/catalogos/vendedores',
                  claimValue:'Configuración.Configuración de módulos.Ventas.Catálogos.Vendedores.Leer'
                },
                {
                  segment: 'Tipos de consignar',
                  title: 'Tipos de consignar',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/catalogos/tipos-consignar',
                }
              ]
            },
            {
              segment: 'Diseño de tableros y reportes ventas',
              title: 'Diseño de tableros y reportes',
              icon: '',
              children: [
                {
                  segment: 'Tablero inicial (Dashboard)',
                  title: 'Tablero inicial (Dashboard)',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/tablero-inicial',
                },
                {
                  segment: 'Plantillas reporte',
                  title: 'Plantillas reporte',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/ventas/plantillas-reporte',
                }
              ]
            }
          ]
        },
        {
          segment: 'Finanzas',
          title: 'Finanzas',
          icon: '',
          claimValue:'Configuración.Configuración de módulos.Finanzas.Leer',
          children: [
            {
              segment: 'Catálogos finanzas',
              title: 'Catálogos',
              icon: '',
              children: [
                {
                  segment: 'Tipos de cobros (Estatus crediticio)',
                  title: 'Tipos de cobros (Estatus crediticio)',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/tipos-cobros',
                },
                {
                  segment: 'Tipos de documentos CXC',
                  title: 'Tipos de documentos CXC',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc',
                  claimValue:'Configuración.Configuración de módulos.Finanzas.Catálogos.Tipos de documentos CXC.Leer' // TODO: Reemplazar cuando tenga el claim de la vista
                },
                {
                  segment: 'Tipos de documentos CXP',
                  title: 'Tipos de documentos CXP',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxp',
                  claimValue:'Configuración.Configuración de módulos.Finanzas.Catálogos.Tipos de documentos CXP.Leer' // TODO: Reemplazar cuando tenga el claim de la vista
                },
                {
                  segment: 'Tipos de documentos de bancarios',
                  title: 'Tipos de documentos de bancarios',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-bancarios',
                },
                {
                  segment: 'Tipos de transacciones bancarias',
                  title: 'Tipos de transacciones bancarias',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/tipos-transacciones-bancarias',
                },
                {
                  segment: 'Conceptos de transacciones de CXC',
                  title: 'Conceptos de transacciones de CXC',
                  icon: '',                  
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc',
                  claimValue: 'Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos transacciones CXC.Leer'
                },
                {
                  segment: 'Conceptos de transacciones de CXP',
                  title: 'Conceptos de transacciones de CXP',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxp',
                  claimValue: 'Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos transacciones CXP.Leer'
                },
                {
                  segment: 'Conceptos de cuentas por pagar',
                  title: 'Conceptos de cuentas por pagar',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-cuentas-pagar',
                },
                {
                  segment: 'Conceptos de cuentas por cobrar',
                  title: 'Conceptos de cuentas por cobrar',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-cuentas-cobrar',
                },
                {
                  segment: 'Conceptos de presupuestos',
                  title: 'Conceptos de presupuestos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-presupuestos',
                },
                {
                  segment: 'Conceptos de gasto/inversión',
                  title: 'Conceptos de gasto/inversión',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-gasto/inversion',
                },
                {
                  segment: 'Conceptos de transacciones bancarias',
                  title: 'Conceptos de transacciones bancarias',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias',
                  claimValue: 'Configuración.Configuración de módulos.Finanzas.Catálogos.Conceptos de transacciónes bancarias.Leer',
                },
                {
                  segment: 'Cuentas bancarias',
                  title: 'Cuentas bancarias',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias',
                  claimValue:'Configuración.Configuración de módulos.Finanzas.Catálogos.Cuentas bancarias.Leer'
                },
                {
                  segment: 'Tipos de contratos bancarios',
                  title: 'Tipos de contratos bancarios',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/catalogos/tipos-contratos-bancarios',
                  claimValue: 'Configuración.Configuración de módulos.Finanzas.Catálogos.Tipos de contratos bancarios.Leer'
                },
                // {
                //   segment: 'Conceptos de gastos/inversión'
                // }
              ]
            },
            {
              segment: 'Diseño de tableros y reportes finanzas',
              title: 'Diseño de tableros y reportes',
              icon: '',
              children: [
                {
                  segment: 'Tablero inicial (Dashboard)',
                  title: 'Tablero inicial (Dashboard)',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/tablero-inicial',
                },
                {
                  segment: 'Plantillas reporte',
                  title: 'Plantillas reporte',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/finanzas/plantillas-reporte',
                }
              ]
            }
          ]
        },
        {
          segment: 'Distribución',
          title: 'Distribución',
          icon: '',
          claimValue:'Configuración.Configuración de módulos.Distribución.Leer',
          children: [
            {
              segment: 'Catálogos distribucion',
              title: 'Catálogos',
              icon: '',
              children: [
                {
                  segment: 'Chóferes',
                  title: 'Chóferes',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/catalogos/chóferes',
                },
                {
                  segment: 'Vehículos',
                  title: 'Vehículos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/catalogos/vehículos',
                },
                {
                  segment: 'Códigos de población',
                  title: 'Códigos de población',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/catalogos/códigos-población',
                },
                {
                  segment: 'Zonas',
                  title: 'Zonas',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/catalogos/zonas',
                },
                {
                  segment: 'Rutas',
                  title: 'Rutas',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/catalogos/rutas',
                },
                {
                  segment: 'Transportistas y paquetería',
                  title: 'Transportistas y paquetería',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/catalogos/transportistas-paquetería',
                }
              ]
            },
            {
              segment: 'Diseño de tableros y reportes distribucion',
              title: 'Diseño de tableros y reportes',
              icon: '',
              children: [
                {
                  segment: 'Tablero inicial (Dashboard)',
                  title: 'Tablero inicial (Dashboard)',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/tablero-inicial',
                },
                {
                  segment: 'Plantillas reporte',
                  title: 'Plantillas reporte',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/distribucion/plantillas-reporte',
                }
              ]
            }
          ]
        },
        {
          segment: 'Proyectos',
          title: 'Proyectos',
          icon: '',
          claimValue:'Configuración.Configuración de módulos.Proyectos.Leer',
          children: [
            {
              segment: 'Catálogos proyectos',
              title: 'Catálogos',
              icon: '',
              children: [
                {
                  segment: 'Tipos de proyectos',
                  title: 'Tipos de proyectos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/proyectos/catalogos/tipos-proyectos',
                },
                {
                  segment: 'Conceptos de proyectos',
                  title: 'Conceptos de proyectos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/proyectos/catalogos/conceptos-proyectos',
                },
                {
                  segment: 'Estatus de proyectos',
                  title: 'Estatus de proyectos',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/proyectos/catalogos/estatus-proyectos',
                },
                {
                  segment: 'Motivo de sanciones',
                  title: 'Motivo de sanciones',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/proyectos/catalogos/motivo-sanciones',
                }
              ]
            },
            {
              segment: 'Diseño de tableros y reportes proyectos',
              title: 'Diseño de tableros y reportes',
              icon: '',
              children: [
                {
                  segment: 'Tablero inicial (Dashboard)',
                  title: 'Tablero inicial (Dashboard)',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/proyectos/tablero-inicial',
                },
                {
                  segment: 'Plantillas reporte',
                  title: 'Plantillas reporte',
                  icon: '',
                  src: '/configuracion/configuracion-modulos/proyectos/plantillas-reporte',
                }
              ]
            }
          ]
        }
      ]
    },
  ];