import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/services/authSlice';
import authReducerNormal from '@/services/authNormalSlice';
import companyReducer from '@/admin/empresas/services/companySlices';
import usersReducer from '@/admin/usuarios/services/usersSlice';
import usersCompanyReducer from '@/app/configuracion/configuracion-sistemas/control-usuarios/usuarios/services/usersCompanySlice';
// import claimsReducer from '@/app/admin/usuarios/services/claimsSlices'; // Versión en desuso
import claimsReducer from '@/lib/services/claims/claimsSlices'
import departmentReducer from '@/services/departments/departmentsSlice';
//import claimsReducer from '@/app/admin/usuarios/services/claimsSlices';
import plantillasReducer from '@/app/admin/plantillas/services/plantillasSlice';
import plantillasCompanyReducer from '@/app/configuracion/configuracion-sistemas/control-usuarios/plantillas/services/plantillasCompanySlice';
import branchesReducer from '../services/branches/branchesSlice';
import userActivityReducer from '@/services/userActivity/userActivitySlice';
import {catalogSatReducer } from '@/app/configuracion/configuracion-modulos/catalogos-sat/services/catalogSatSlice'
import { areasReducer } from '@/app/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/services/areasSlice';
import { puestosReducer } from '@/app/configuracion/configuracion-empresa/informacion-empresa/puestos/services/puestosSlice';
import { CancelConceptsReducer } from '@/app/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion/services/conceptosCancelSlice';
import { clientClassificationsReducer } from '@/app/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes/services/clientClassificationsSlice';
import { returnConceptsReducer } from '@/app/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion/services/returnConceptsSlice';
import clientSubclassificationReducer from '@/app/configuracion/configuracion-modulos/ventas/catalogos/subclasificacion-clientes/services/clientsSubclassificationSlice';
import { restrictionConceptsReducer } from '@/app/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones/services/restrictionConceptsSlice';
import { EstatusProdReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/estatus-de-producto/services/estatusProdSlice';
import { empaquesReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/empaques/services/empaquesSlice';
import { PresentacionesReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones/services/presentacionesSlice';
import { clientTypesReducer } from '@/app/configuracion/configuracion-modulos/ventas/catalogos/tipos-clientes/services/clientTypesSlice';
import { MarcasReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/marcas/services/MarcasSlice';
import { fabricanteReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes/services/fabricanteSlice';
import { zonasReducer } from '@/app/configuracion/configuracion-modulos/generales/catalogos/zonas/services/zonasSlice';
import { sellersTypesReducer } from '@/app/configuracion/configuracion-modulos/ventas/catalogos/tipos-vendedores/services/sellersTypesSlice';
import { subZonasReducer } from '@/app/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/services/subZonasSlice';
import { keyConfigurationReducer } from '@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationSlice';
import { CategoriesReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/categorias/services/categoriesSlice';
import attributesReducer from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/atributos/services/AttributeSlice';
import attributesValueReducer from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/atributos/[atributoId]/valores/services/AttributeValueSlice';
import { throttleLoading } from './throttleLoading';
import { colaboradoresReducer } from '@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresSlice';
import { colaboradorDocumentacionReducer } from '@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/components/form/documentacion-adicional/services/colaboradorDocumentacionSlice';
import { sellersReducer } from '@/app/configuracion/configuracion-modulos/ventas/catalogos/vendedores/services/sellersSlice';
import { transaccionesDXCReducer } from '@/app/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxc/services/transaccionesDXCSlice';
import { fabricanteDocumentosReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes/[fabricanteId]/files/services/fabricanteDocumentosSlice';
import cxcsReducer from '@/app/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxc/services/CXCSlice';
import cxpsReducer from '@/app/configuracion/configuracion-modulos/finanzas/catalogos/tipos-documentos-cxp/services/CXPSlice';
import { sucursalReducer } from '@/app/configuracion/configuracion-empresa/informacion-empresa/sucursales/services/sucursalesSlice';
import { cuentasBancariasReducer } from '@/app/configuracion/configuracion-modulos/finanzas/catalogos/cuentas-bancarias/services/cuentasBancariasSlice';
import { conceptosTransaccionesBancariasReducer } from '@/app/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-bancarias/services/conceptosTransaccionesBancariasSlice';
import { transaccionesDXPReducer } from '@/app/configuracion/configuracion-modulos/finanzas/catalogos/conceptos-transacciones-cxp/services/transaccionesDXPSlice';
import { TypesWarehousesReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes/services/typesWarehousesSlice';
import { tiposContratosBReducer } from '@/app/configuracion/configuracion-modulos/finanzas/catalogos/tipos-contratos-bancarios/services/tiposContratosBSlice';
import { movimientosInventarioReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/conceptos-movimientos-inventario/services/movimientosInventariosSlice';
import { monedasReducer } from '@/app/configuracion/configuracion-modulos/generales/catalogos/monedas/services/monedasSlice';
import { TipoAlmacenajeReducer } from '@/app/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenaje/services/tipoAlmacenajeSlice';
import { empresaDocumentacionAdicionalReducer } from '@/app/configuracion/configuracion-empresa/informacion-empresa/empresa/components/documentacion-adicional/services/empresaDocumentacionAdicionalSlice';
import { empresaReducer } from '@/app/configuracion/configuracion-empresa/informacion-empresa/empresa/services/empresaSlice';
import { configuracionReducer } from '@/app/configuracion/services/sliceConfig';


const store = configureStore({
  reducer: {
    auth: authReducer,
    authNormal: authReducerNormal,
    company: companyReducer,
    users: usersReducer,
    usersCompany: usersCompanyReducer,
    claims: claimsReducer,
    departments: departmentReducer,
    plantillas: plantillasReducer,
    plantillasCompany: plantillasCompanyReducer,
    colaboradores: colaboradoresReducer,
    colaboradoresDocumentacion: colaboradorDocumentacionReducer,
    branches: branchesReducer,
    userActivity: userActivityReducer,
    catalogSat: catalogSatReducer,
    areas: areasReducer,
    puestos: puestosReducer,
    ConceptoCancelacion: CancelConceptsReducer,
    empresa: empresaReducer,
    empresaDocumentacion: empresaDocumentacionAdicionalReducer,

    sucursales: sucursalReducer,
    monedas: monedasReducer,
    // // Ventas
    // Catalogos Ventas
    clientClassification: clientClassificationsReducer,
    returnConcepts: returnConceptsReducer,
    clientSubclassification: clientSubclassificationReducer,
    restrictionConcepts: restrictionConceptsReducer,
    estatus: EstatusProdReducer,
    empaques: empaquesReducer,
    presentaciones: PresentacionesReducer,
    clientTypes: clientTypesReducer,
    marcas: MarcasReducer,
    fabricantes: fabricanteReducer,
    fabricanteDocumentos: fabricanteDocumentosReducer,
    zonas: zonasReducer,
    subZonas: subZonasReducer,
    sellersTypes: sellersTypesReducer,
    keyConfigurationReducer: keyConfigurationReducer,
    categories: CategoriesReducer,
    sellers: sellersReducer,
    transaccionesDXC: transaccionesDXCReducer,
    transaccionesDXP: transaccionesDXPReducer,
    tiposContratosB: tiposContratosBReducer,

    // // Almacenes
    // Catalogos Almacenes
    attribute: attributesReducer,
    values:  attributesValueReducer,
    typesWarehouses: TypesWarehousesReducer,
    movimientosInventario: movimientosInventarioReducer,
    tiposAlmacenaje: TipoAlmacenajeReducer,
    // // Finanzas
    // Catalogos Finanzas
    cxcs: cxcsReducer,
    cxps: cxpsReducer,
    cuentasBancarias: cuentasBancariasReducer,
    conceptosTransaccionesBancarias: conceptosTransaccionesBancariasReducer,
    configuracion: configuracionReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(throttleLoading), // Middleware para manejar la carga con debounce c:
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
