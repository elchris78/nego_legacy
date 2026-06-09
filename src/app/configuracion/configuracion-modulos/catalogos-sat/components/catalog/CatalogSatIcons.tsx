import {
  AccountBalance,
  AnalyticsOutlined,
  ArticleOutlined,
  AssuredWorkload,
  CorporateFareOutlined,
  DescriptionOutlined,
  FactCheckOutlined,
  HealthAndSafetyOutlined,
  Inventory2Outlined,
  LocalShippingOutlined,
  MarkEmailReadOutlined,
  PaidOutlined,
  PaymentsOutlined,
  PersonSearchOutlined,
  PinDropOutlined,
  PublicOutlined,
  TaskOutlined,
  WarningAmberOutlined,
  DisabledByDefaultOutlined,
} from "@mui/icons-material";

const iconsStyles = {
  fontSize: 50,
};

const CatalogSatIcons = () => {
  const categoryIcons: Record<string, JSX.Element> = {
    usoscfdi: <ArticleOutlined sx={iconsStyles} />, // Usos CFDI
    unidadespeso: <AnalyticsOutlined sx={iconsStyles} />, // Unidades de Peso
    unidadesmedida: <AnalyticsOutlined sx={iconsStyles} />, // Unidades de Medida
    tiposrelacion: <PersonSearchOutlined sx={iconsStyles} />, // Tipos de Relación
    tipospermiso: <FactCheckOutlined sx={iconsStyles} />, // Tipos de Permiso
    regimenesfiscales: <DescriptionOutlined sx={iconsStyles} />, // Régimenes Fiscales
    municipios: <PinDropOutlined sx={iconsStyles} />, // Municipios
    metodospago: <PaymentsOutlined sx={iconsStyles} />, // Métodos de Pago
    localidades: <PinDropOutlined sx={iconsStyles} />, // Localidades
    formaspago: <PaymentsOutlined sx={iconsStyles} />, // Formas de Pago
    estados: <PinDropOutlined sx={iconsStyles} />, // Estados
    colonias: <PinDropOutlined sx={iconsStyles} />, // Colonias
    codigospostales: <MarkEmailReadOutlined sx={iconsStyles} />, // Códigos Postales
    claveprodserv: <Inventory2Outlined sx={iconsStyles} />, // Clave Prod Serv
    claveprodservcartaporte: <Inventory2Outlined sx={iconsStyles} />, // Clave Prod Serv Carta Porte
    bancos: <AccountBalance sx={iconsStyles} />, // Bancos
    configautotransportefederal: <LocalShippingOutlined sx={iconsStyles} />, // Configuración Autotransporte Federal
    monedas: <PaidOutlined sx={iconsStyles} />, // Monedas
    exportaciones: <PublicOutlined sx={iconsStyles} />, // Exportaciones
    paises: <PinDropOutlined sx={iconsStyles} />, // Países
    objetosimpuesto: <FactCheckOutlined sx={iconsStyles} />, // Objetos de Impuesto
    impuestos: <PaymentsOutlined sx={iconsStyles} />, // Impuestos
    tiposfactor: <FactCheckOutlined sx={iconsStyles} />, // Tipos de Factor
    aduanas: <AssuredWorkload sx={iconsStyles} />, // Aduanas
    patentesaduana: <TaskOutlined sx={iconsStyles} />, // Patentes Aduana
    regimenesaduaneros: <DescriptionOutlined sx={iconsStyles} />, // Régimenes Aduaneros
    materialespeligrosos: <WarningAmberOutlined sx={iconsStyles} />, // Materiales Peligrosos
    tiposembalaje: <Inventory2Outlined sx={iconsStyles} />, // Tipos de Embalaje
    sectorescofepris: <CorporateFareOutlined sx={iconsStyles} />, // Sectores COFEPRIS
    formasfarmaceuticas: <HealthAndSafetyOutlined sx={iconsStyles} />, // Formas Farmacéuticas
    documentosaduaneros: <TaskOutlined sx={iconsStyles} />, // Documentos Aduaneros
    tiposremolque: <LocalShippingOutlined sx={iconsStyles} />, // Tipos de Remolque
    registrosistmo: <ArticleOutlined sx={iconsStyles} />, // Registros ISTMO
    numerospedimentosaduanales: <ArticleOutlined sx={iconsStyles} />, // Números Pedimentos Aduanales
    clavestransporte: <LocalShippingOutlined sx={iconsStyles} />, // Claves de Transporte
    motivoscancelacion: <DisabledByDefaultOutlined sx={iconsStyles} />, // Motivos de Cancelación
  };

  return {
    categoryIcons,
  };
};

export default CatalogSatIcons;
