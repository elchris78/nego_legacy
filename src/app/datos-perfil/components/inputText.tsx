import React from 'react'
import { Label } from '@/ui/label'
import { Input } from '@/ui/input'
import { IconButton, Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface inputTextProps {
    label?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    readonly?: boolean
    placeholder?: string
    tooltip: string
}

const InputText: React.FC<inputTextProps> = ({ label, value, onChange, className, readonly, placeholder,tooltip }) => {
  return (
    <>
        <Label>{label}</Label>
        <Tooltip title={tooltip} placement="top" arrow>
            <IconButton sx={{ ml: 1 }}>
                <HelpOutlineIcon fontSize="small" color="action" />
            </IconButton>
        </Tooltip> 
        <Input
            className={`${className}`}
            placeholder={placeholder}
            readOnly={readonly}
            value={value}
            onChange={onChange}
        />

    </>
  )
}

export default InputText
