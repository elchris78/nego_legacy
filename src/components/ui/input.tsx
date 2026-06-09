import * as React from "react";
import { cn } from "@/lib/utils"; // Si estás usando alguna función de clase dinámica (opcional)
import { InputAdornment, FormHelperText, FormControl } from "@mui/material";
import { error } from 'console';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  InputProps?: {
    endAdornment?: React.ReactNode; 
    readOnly?: boolean; 
  };
  helperText?: string; 
  fullWidth?: boolean;
  type?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isError, onChange, InputProps, helperText, fullWidth, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input         
          type={type}
          className={cn(
            "mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm disabled:bg-[#E3E1E6] disabled:text-gray-500 focus:ring-1 focus:ring-[#4197CB] focus:border-[#4197CB] focus:outline-none placeholder:text-muted-foreground",
            isError ? "border-red-500 bg-red-100" : "border-gray-300",
            className
          )}
          ref={ref}
          onChange={onChange}
          readOnly={InputProps?.readOnly} // Usar readOnly de InputProps si está definido
          {...props}
        />
        {InputProps?.endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {InputProps.endAdornment}
          </div>
        )}
        {/* Agregar FormHelperText aquí si hay un mensaje de error */}
        {helperText && (
          <FormHelperText error={isError} className="mt-1">
            {helperText}
          </FormHelperText>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };  export type { InputProps };

