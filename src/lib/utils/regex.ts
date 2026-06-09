// Solo permite primera letra mayúscula, letras con tilde y espacios
export const onlyLettersWithAccents = /^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;

// Permite letras, números y espacios, pero la primera letra debe ser mayúscula
export const lettersAndNumbers = /^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;

// La primera letra debe ser mayúscula
export const firstLetterUppercase = /^[A-ZÁÉÍÓÚÑ].*$/;

// Validación para correos electrónicos
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validación de números de teléfono (10 dígitos)
export const phoneNumberRegex = /^[0-9]{10}$/;

// Permite letras, números y caracteres especiales. La primera letra debe ser mayúscula.
export const lettersNumbersSpecialsFirstUppercase = /^[A-ZÁÉÍÓÚÑ][\w\s\W]*$/;

// Sólo permite números
export const onlyNumbers = /^[0-9]+$/;

// Alfanumerico con letras acentuadas y ñ
export const alphanumericRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ]+$/;

// Alfanumerico sin letras acentuadas y ñ
export const alphanumericNoAccentsRegex = /^[a-zA-Z0-9]+$/;

// Validación para RFC (Registro Federal de Contribuyentes, ejemplo: ABC123456789)
export const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/; 

// Solo números con punto decimal, mayor a 0 y menor a 999.9999, hasta 4 decimales
export const floatRegex = /^(?!0+(?:\.0+)?$)(?!999\.9999$)(?!1000)(\d{1,3}(\.\d{1,4})?)$/;
// Permite letras y números sin espacios
export const lettersAndNumbersNoSpaces = /^[A-Za-z0-9]+$/;
