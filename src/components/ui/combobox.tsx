import * as React from "react";
import { Check } from "lucide-react";
import Down from "@/assets/down.svg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface ComboBoxOption {
  value: string;
  label: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  placeholder?: string;
  onSelect?: (value: string) => void;
  emptySearchMessage?: string;
  hasError?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  value?: string; // <-- agrega esto
  onInputChange?: (value: string) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  placeholder = "Selecciona una opción",
  onSelect,
  emptySearchMessage = "No hay resultados",
  hasError = false,
  disabled = false,
  defaultValue,
  value: controlledValue, // <-- agrega esto
  onInputChange
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  // Sincroniza el valor local con defaultValue si cambia
  React.useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  // Sincroniza el valor local con value si es controlado
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="mt-1 h-10">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal text-base",
            hasError
              ? "border-red-500 text-red-500 hover:text-red-600"
              : "border-gray-300 text-gray-600 hover:text-gray-700",
            disabled &&
              "disabled:bg-[#E3E1E6] disabled:text-gray-500 disabled:cursor-auto"
          )}
          disabled={disabled}
        >
          <span className="block flex-1 min-w-0 truncate text-left">
            {value
              ? options.find((option: any) => option.value == value)?.label
              : placeholder}
          </span>
          <Down />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput
            placeholder="Buscar..."
            className="h-10 w-full"
            onValueChange={(val) => {
              if (onInputChange) onInputChange(val);
            }}
          />
          <CommandList className="w-full">
            <CommandEmpty>{emptySearchMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option: any) => (
                <CommandItem
                  key={option.value}
                  value={`${option.value} ${option.label}`}
                  onSelect={(currentValue) => {
                    const newValue = option.value === value ? "" : option.value;
                    setValue(newValue);
                    setOpen(false);
                    if (onSelect) onSelect(newValue);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
