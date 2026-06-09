import ConceptosCancel from "@/Asset/ConceptosCancel.svg";
import ConceptosDev from "@/Asset/ConceptosDev.svg";
import ConceptosPendi from "@/Asset/ConceptosPendi.svg";
import ConceptosRee from "@/Asset/ConceptosReest.svg";
import ConceptosSD from "@/Asset/ConceptosSeguimient.svg";
import EstatusDoc from "@/Asset/EstatusDoc.svg";
import EstatusPendi from "@/Asset/EstatusPendi.svg";
import TipoDoc from "@/Asset/TiposDoc.svg";
import TipoPendi from "@/Asset/TiposPendi.svg";
import { PinDropOutlined, Segment } from "@mui/icons-material";
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';

export const catalogData = [
  {
    segment: "Conceptos de cancelación",
    title: "Conceptos de cancelación",
    icon: <ConceptosCancel />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion",
    claimValue:
      "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Cancelación.Leer",
  },
  {
    segment: "Conceptos de devolución",
    title: "Conceptos de devolución",
    icon: <ConceptosDev />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion",
    claimValue:
      "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de Devolución.Leer",
  },
  {
    segment: "Conceptos de pendiente",
    title: "Conceptos de pendiente",
    icon: <ConceptosPendi />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/conceptos-pendiente",
    // claimValue:""
  },
  {
    segment: "Conceptos de restricciones",
    title: "Conceptos de restricciones",
    icon: <ConceptosRee />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones",
    claimValue:
      "Configuración.Configuración de módulos.Generales.Catálogos.Conceptos de restricciones.Leer",
  },
  {
    segment: "Conceptos de seguimiento de documentos",
    title: "Conceptos de seguimiento de documentos",
    icon: <ConceptosSD />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/conceptos-seguimiento",
    // claimValue:""
  },
  {
    segment: "Estatus de documentos",
    title: "Estatus de documentos",
    icon: <EstatusDoc />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/estatus-documentos",
    // claimValue:""
  },
  {
    segment: "Estatus de pendientes",
    title: "Estatus de pendientes",
    icon: <EstatusPendi />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/estatus-pendientes",
    // claimValue:""
  },
  {
    segment: "Tipo de documentos",
    title: "Tipo de documentos",
    icon: <TipoDoc />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/tipo-documentos",
    // claimValue:""
  },
  {
    segment: "Tipo de pendientes",
    title: "Tipo de pendientes",
    icon: <TipoPendi />,
    src: "/configuracion/configuracion-modulos/generales/catalogos/tipo-pendientes",
    // claimValue:""
  },
  {
    segment: "Zonas",
    title: "Zonas",
    icon: (
      <PinDropOutlined
        sx={{
          color: "#b8b8b8",
          fontSize: "4rem",
        }}
      />
    ),
    src: "/configuracion/configuracion-modulos/generales/catalogos/zonas",
    claimValue:"Configuración.Configuración de módulos.Generales.Catálogos.Zonas.Leer"
  },
  {
    segment: "Sub zonas",
    title: "Sub zonas",
    icon: (
      <PinDropOutlined
        sx={{
          color: "#b8b8b8",
          fontSize: "4rem",
        }}
      />
    ),
    src: "/configuracion/configuracion-modulos/generales/catalogos/sub-zonas",
    claimValue:"Configuración.Configuración de módulos.Generales.Catálogos.SubZonas.Leer"
  },
  {
    segment: "Monedas",
    title: "Monedas",
    icon: (
      <PaymentsOutlinedIcon
        sx={{
          color: "#b8b8b8",
          fontSize: "4rem",
        }}
      />
    ),
    src: "/configuracion/configuracion-modulos/generales/catalogos/monedas",
    claimValue:"Configuración.Configuración de módulos.Generales.Catálogos.Monedas.Leer"
  }
];
