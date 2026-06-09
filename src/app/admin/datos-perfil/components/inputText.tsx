import React, { useState } from 'react';
import { TextField, Typography, SxProps } from '@mui/material';
import { ComicTooltip } from '@/components/ui/LabelTooltip';
import { HelpCircle } from 'lucide-react';
import { CalendarDays } from 'lucide-react'; // puedes cambiar este ícono si prefieres otro
import InputAdornment from '@mui/material/InputAdornment';
import Calendar from '@/assets/Calendar.svg'


interface InputTextProps {
  tooltip: string;
  label: string;
  placeholder?: string;
  value?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  type?: string;
  dynamicType?: boolean;
  sx?: SxProps;
  max?: string;
  disabled?: boolean;
}

const InputText: React.FC<InputTextProps> = ({
  tooltip,
  label,
  placeholder,
  value,
  name,
  onChange,
  readonly,
  type = 'text',
  dynamicType = false,
  sx,
  max,
  disabled = false,
}) => {
  const [inputType, setInputType] = useState<string>(type);

  const handleFocus = () => {
    if (dynamicType) {
      setInputType('date');
    }
  };

  const handleBlur = () => {
    if (dynamicType) {
      setInputType('text');
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1">
        <Typography sx={{fontWeight: 700, color:"#5D6D7E"}}>{label}</Typography>
        <ComicTooltip title={tooltip} arrow={false} placement="right">
          <HelpCircle className="h-4 w-5 text-[#5B89B4]" />
        </ComicTooltip>
      </div>

      <TextField
        fullWidth
        type={dynamicType ? inputType : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        InputProps={{
          readOnly: readonly,
          startAdornment: dynamicType && inputType === 'date' && (
            <InputAdornment position="start">
              <Calendar className="text-gray-500" />
            </InputAdornment>
          ),
          sx: {
            '& input[type="date"]::-webkit-calendar-picker-indicator': {
              display: 'none', // oculta el ícono nativo
              WebkitAppearance: 'none',
            },
          },
        }}
        inputProps={{
          max: max,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            ...(disabled
              ? {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#949DA4',
                  },
                }
              : {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#949DA4',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#949DA4',
                  },
                }),
          },
          '& .MuiInputBase-input': {
            padding: '10px 14px',
          },
          ...sx,
        }}
      />
    </div>
  );
};

export default InputText;
