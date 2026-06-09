import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import {
  alphanumericNoAccentsRegex,
  floatRegex,
  onlyNumbers,
} from "@/utils/regex";
import { useMonedasForm } from "./MonedasContext";
import { Textarea } from "@/components/ui/textarea";
import { getCountries } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import Cookies from "js-cookie";
import { Option } from "@/components/ui/multiselect";
import ComboBox from "@/components/ui/combobox";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { monedasActions } from "../../services/monedasSlice";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token")
  const dispatch: AppDispatch = useDispatch();
  const [countriesOptions, setCountriesOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const catMonedas = useSelector((state: RootState) => state.monedas.monedasSat);
  const { generalDataForm, currentMonedas, keyConfig } =
    useMonedasForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    trigger, // Destructure trigger from generalDataForm
  } = generalDataForm;


  // Asign default values only on editing
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentMonedas) {
      setValue("userProvidedId", currentMonedas.id ?? "");
      setValue("userProvidedPrefix", keyConfig?.prefijo ?? "");
      setValue("monedaSatId", currentMonedas.monedaSatId, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("descripcion", currentMonedas.descripcion, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("paisId", currentMonedas.paisId, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("tipoCambio", currentMonedas.tipoCambio, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "userProvidedId",
        currentMonedas.userProvidedId ?? currentMonedas.id ?? "",
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentMonedas, setValue, trigger]); // Update dependency array

  useEffect(() => {
    if (!token) return;
    const fetchCountries = async () => {
      const resp = await getCountries({ token });
      const options = resp.map((country) => ({
        value: country.c_Pais,
        label: `${country.c_Pais} - ${country.descripcion}`,
      }));
      setCountriesOptions(options);
    };

    fetchCountries();
  }, [token]);

  const filteredCountries = countriesOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (token) {
      dispatch(monedasActions.getCatalogoMonedas({ token }));
    }
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID tipo de vendedor */}
        <div>
          <LabelTooltip
            label="*Clave"
            tooltip="Ingresa una clave única para identificar el registro. Puede generarse automáticamente o definirse manualmente, según la configuración del sistema."
            htmlFor="Clave"
          />
          <Input
            id="Clave"
            type="text"
            placeholder="Ingresa clave"
            value={watch("userProvidedId")}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("userProvidedId", {
              required:
                mode === "new" &&
                (keyConfig?.tipoClave === "Numérico" ||
                  keyConfig?.tipoClave === "Alfanumérico")
                  ? "La clave es requerida"
                  : false,
              pattern:
                mode === "new"
                  ? {
                      value:
                        keyConfig?.tipoClave === "Alfanumérico"
                          ? alphanumericNoAccentsRegex
                          : onlyNumbers,
                      message:
                        keyConfig?.tipoClave === "Alfanumérico"
                          ? "La clave debe ser alfanumérica"
                          : "La clave debe ser numérica",
                    }
                  : undefined,
              minLength: {
                value: 1,
                message: "La clave debe tener al menos 1 caracter",
              },
              validate: (value) => {
                if (mode === "new" && keyConfig?.longitudMaxima) {
                  if (value && value.length > keyConfig.longitudMaxima) {
                    return `La clave no puede exceder los ${keyConfig.longitudMaxima} caracteres`;
                  }
                }
                return true;
              },
            })}
          />
          {errors.userProvidedId && (
            <span className="text-[#CF5459] text-xs">
              {errors.userProvidedId.message}
            </span>
          )}
        </div>

        {keyConfig?.tienePrefijo &&
          keyConfig?.tipoPrefijo === "Variable" &&
          mode === "new" && (
            <div>
              <LabelTooltip
                label="*Prefijo"
                tooltip="Ingresa el prefijo personalizado"
                htmlFor="prefix-input"
              />
              <Input
                id="prefix-input"
                type="text"
                placeholder="Prefijo personalizado"
                isError={!!errors.userProvidedPrefix}
                disabled={mode !== "new"}
                {...register("userProvidedPrefix", {
                  required: mode === "new" && "Campo requerido",
                  pattern: {
                    value: alphanumericNoAccentsRegex,
                    message: "El prefijo debe ser alfanumérico",
                  },
                  maxLength: {
                    value: 3,
                    message: "El prefijo no puede exceder los 3 caracteres",
                  },
                })}
              />
              {errors.userProvidedPrefix && (
                <span className="text-[#CF5459] text-xs">
                  {errors.userProvidedPrefix.message}
                </span>
              )}
            </div>
          )}


        {/* Moneda SAT */}
        <div>
          <LabelTooltip
            label="*Moneda SAT"
            tooltip="Selecciona la moneda conforme al catálogo oficial del SAT. "
            htmlFor="monedaSat"
          />
          <ComboBox
            options={catMonedas}
            placeholder="Selecciona una opción"
            disabled={mode !== "new"}
            defaultValue={watch("monedaSatId") || undefined} 
            {...register("monedaSatId", {
              required: "Campo requerido",})}
            onSelect={(value) => {
              setValue("monedaSatId", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("monedaSatId");
            }}
          />
          {errors.monedaSatId && (
            <span className="text-[#CF5459] text-xs">
              {errors.monedaSatId?.message}
            </span>
          )}
        </div>

        <div>
          <LabelTooltip
            label="*Tipo de cambio"
            tooltip="Ingresa el tipo de cambio aplicable. Debe ser un número decimal mayor a cero, con hasta 4 decimales."
            htmlFor="tipoCambio"
          />
          <Input 
            id="tipoCambio"
            type="text"
            placeholder="Ingresa tipo de cambio"
            isError={!!errors.tipoCambio}
            disabled={mode === "view"}
            {...register("tipoCambio", {
              required: "Campo requerido",
              pattern: {
                value: floatRegex,
                message:
                  "Formato inválido: solo números decimales mayores a 0 y menores que 999.9999, con máximo 4 decimales",
              },
            })}
          />
          {errors.tipoCambio && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipoCambio?.message}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div>
          <LabelTooltip
            label="Descripción"
            tooltip="Proporciona una descripción clara y concisa del registro. Solo se permiten letras, números y signos de puntuación."
            htmlFor="description"
          />
          <Textarea
            id="description"
            placeholder="Ingresa una descripción"
            isError={!!errors.descripcion}
            disabled={mode === "view"}
            {...register("descripcion", {
              minLength: {
                value: 4,
                message: "La descripción debe tener al menos 4 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La descripción no puede exceder los 100 caracteres",
              },
            })}
          />
          {errors.descripcion && (
            <span className="text-[#CF5459] text-xs">
              {errors.descripcion?.message}
            </span>
          )}
        </div>

        {/* País */}
        <div className="flex-1">
          <LabelTooltip
            label="*País"
            tooltip="Selecciona el país correspondiente al registro. Puedes buscarlo por nombre o clave de país."
            htmlFor="pais"
          />
          <ComboBox
            options={filteredCountries}
            placeholder="Selecciona una opción"
            disabled={mode === "view"}
            defaultValue={watch("paisId") || undefined}
            onInputChange={(value) => setSearchTerm(value)}
            {...register("paisId", { required: "Campo requerido" })}
            onSelect={(value) => {
              setValue("paisId", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("paisId");
            }}
          />
          {errors.paisId && (
            <span className="text-[#CF5459] text-xs">
              {errors.paisId?.message}
            </span>
          )}
        </div>
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm">
        * Campos obligatorios
      </span>
    </>
  );
};

export default GeneralDataForm;
