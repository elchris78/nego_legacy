import React, { useState } from 'react';
import { Label } from '@/ui/label';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectValue } from '@/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

interface Field {
    label: string;
    name: string;
    type: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    onChange?: (value: string) => void;
}

interface FormProps<T> {
    fields: Field[];
    onSubmit: (data: T) => void; // Usar el tipo genérico T
    title: string;
}

const FormBase = <T,>({ fields, onSubmit, title }: FormProps<T>) => {
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Formulario enviado', formData);
        onSubmit(formData as T); // Convertir formData al tipo T
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.reduce((acc: JSX.Element[], field, index) => {
                        if (index % 2 === 0) {
                            acc.push(
                                <div key={index} className="flex space-x-4 mb-4">
                                    <div className="w-full">
                                        <Label htmlFor={field.name} className="font-medium">{field.label}</Label>
                                        {field.type === 'select' ? (
                                            <Select onValueChange={(value) => handleSelectChange(field.name, value)} required={field.required}>
                                                <SelectTrigger className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                                                    <SelectValue placeholder={field.placeholder} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{field.label}</SelectLabel>
                                                        {field.options?.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                type={field.type}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                required={field.required}
                                                readOnly={field.readonly}
                                                className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300"
                                            />
                                        )}
                                    </div>
                                    {fields[index + 1] && (
                                        <div className="w-full">
                                            <Label htmlFor={fields[index + 1].name} className="font-medium">{fields[index + 1].label}</Label>
                                            {fields[index + 1].type === 'select' ? (
                                                <Select onValueChange={(value) => handleSelectChange(field.name, value)} required={field.required}>
                                                    <SelectTrigger className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                                                        <SelectValue placeholder={field.placeholder} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    type={fields[index + 1].type}
                                                    name={fields[index + 1].name}
                                                    placeholder={fields[index + 1].placeholder}
                                                    value={formData[fields[index + 1].name] || ''}
                                                    onChange={handleChange}
                                                    required={fields[index + 1].required}
                                                    readOnly={fields[index + 1].readonly}
                                                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        return acc;
                    }, [])}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                    >
                        Enviar
                    </Button>
                </form>
            </CardContent>
        </>
    );
};

export default FormBase;
