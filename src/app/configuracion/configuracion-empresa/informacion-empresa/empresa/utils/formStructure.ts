export function objectToFormData(
  obj: any,
  form?: FormData,
  namespace?: string
): FormData {
  const fd = form || new FormData();

  for (const property in obj) {
    if (!obj.hasOwnProperty(property)) continue;
    const value = obj[property];

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
