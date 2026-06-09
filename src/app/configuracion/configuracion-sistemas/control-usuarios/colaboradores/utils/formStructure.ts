import { GetCatalogoClave } from "../../../configuracion-claves/services/keyConfigurationTypes";

export function cleanArrays(
  obj: any,
  keyConfig: GetCatalogoClave | null,
  mode: string | null
): any {
  // Función para verificar si algún campo tiene valor
  const tieneValor = (item: any) =>
    Object.values(item).some((val) => val !== "");

  // Clonar el objeto para no mutar el original
  const nuevoObj = { ...obj };

  // Filtrar y validar contactosEmergencia
  if (Array.isArray(obj.contactosEmergencia)) {
    const filtrados = obj.contactosEmergencia.filter(tieneValor);
    if (filtrados.length > 0) {
      nuevoObj.contactosEmergencia = filtrados;
    } else {
      delete nuevoObj.contactosEmergencia;
    }
  }

  // Filtrar y validar avales
  if (Array.isArray(obj.avales)) {
    const filtrados = obj.avales.filter(tieneValor);

    // Incluir documentacionAvales en cada aval según la posición
    if (Array.isArray(obj.documentacionAvales)) {
      filtrados.forEach((aval: any, idx: any) => {
        if (obj.documentacionAvales[idx]) {
          aval.documentacionAvales = obj.documentacionAvales[idx];
        }
      });
    }

    if (filtrados.length > 0) {
      nuevoObj.avales = filtrados;
    } else {
      delete nuevoObj.avales;
    }
    // Ya no necesitamos documentacionAvales como arreglo separado
    delete nuevoObj.documentacionAvales;
  }

  //* Validar configuración de clave
  // Si el modo es nuevo y el prefijo es Fijo, asignar el prefijo fijo de la configuración
  if (mode === "new" && keyConfig?.tienePrefijo) {
    if (keyConfig.tipoPrefijo === "Fijo") {
      nuevoObj.informacionGeneral.userProvidedPrefix = keyConfig.prefijo;
    }
  }

  // Si el modo es edit o view quitar el prefijo y la clave del objeto
  if (mode === "edit" || mode === "view") {
    delete nuevoObj.informacionGeneral.userProvidedPrefix;
    delete nuevoObj.informacionGeneral.userProvidedId;
  }

  return nuevoObj;
}

export function objectToFormData(
  obj: any,
  form?: FormData,
  namespace?: string
): FormData {
  const fd = form || new FormData();

  for (const property in obj) {
    if (!obj.hasOwnProperty(property)) continue;
    const value = obj[property];

    // Elevar userProvidedId y userProvidedPrefix al nivel raíz
    if (
      property === "informacionGeneral" &&
      typeof value === "object" &&
      value !== null
    ) {
      if (value.userProvidedId !== undefined) {
        fd.append("userProvidedId", value.userProvidedId);
      }
      if (value.userProvidedPrefix !== undefined) {
        fd.append("userProvidedPrefix", value.userProvidedPrefix);
      }
      // Clonar el objeto sin esos campos para evitar duplicados en el namespace
      const { userProvidedId, userProvidedPrefix, ...rest } = value;
      if (Object.keys(rest).length > 0) {
        objectToFormData(
          rest,
          fd,
          namespace ? `${namespace}.${property}` : property
        );
      }
      continue; // Ya procesamos este campo
    }

    // Si estamos en avales y la propiedad es documentacionAvales, forzar a array
    if (
      property === "documentacionAvales" &&
      namespace &&
      namespace.match(/^avales\[\d+\]$/)
    ) {
      const formKey = `${namespace}.documentacionAvales[0]`;
      const docAval = Array.isArray(value) ? value[0] : value;
      if (docAval && typeof docAval === "object") {
        objectToFormData(docAval, fd, formKey);
      }
      continue;
    }

    const formKey = namespace ? `${namespace}.${property}` : property;

    if (value instanceof Date) {
      fd.append(formKey, value.toISOString());
    } else if (value instanceof File || value instanceof Blob) {
      fd.append(formKey, value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof File) &&
      !(value instanceof Blob)
    ) {
      if (Array.isArray(value)) {
        value.forEach((el, idx) => {
          objectToFormData(el, fd, `${formKey}[${idx}]`);
        });
      } else {
        objectToFormData(value, fd, formKey);
      }
    } else if (value !== undefined && value !== null) {
      fd.append(formKey, value);
    }
  }

  return fd;
}
