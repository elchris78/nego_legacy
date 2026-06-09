import React from 'react'
import { Label } from '@/ui/label'
import { InputAdornment, IconButton, Tooltip, TextField } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { error } from 'console';


interface inputTextProps {
    label?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    readonly?: boolean
    placeholder?: string
    tooltip: string
    icon?: React.ReactNode 
    type: string
    error:  boolean
    helperText?: string
}

const InputText: React.FC<inputTextProps> = ({
    label,
    value,
    onChange,
    className,
    readonly,
    placeholder,
    tooltip,
    icon,
    type,
    error,
    helperText
}) => {
    return (
        <>
            <Label className='text-[#5D6D7E]'>{label}</Label>
            <Tooltip title={tooltip} placement="top" arrow>
                <IconButton sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="action" />
                </IconButton>
            </Tooltip>
            <TextField
                helperText={helperText}
                error={error}
                className={`${className}`}
                placeholder={placeholder}
                type={type}
                InputProps={{
                    readOnly: readonly,
                    endAdornment: ( 
                        <InputAdornment position="end">
                            {icon}
                        </InputAdornment>
                    ),
                }}
                value={value}
                onChange={onChange}
                fullWidth
            />
        </>
    )
}

export default InputText;
