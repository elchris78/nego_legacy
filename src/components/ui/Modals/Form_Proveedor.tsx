// import React from 'react';
// import FormBase from '../Forms/FormBase';
// import { Proveedor } from '../interface/Interfaz_Proveedor';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
// import axios from 'axios';

// interface FormProveedorProps {
//     onClose: () => void;
// }


// const Form_Proveedor: React.FC <FormProveedorProps> = ({onClose}) => {
//     const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//     const handleFormSubmit = async (data: Proveedor) => {
        
//         const transformedData = {
//             Clave: data.clave,
//             Tipo: data.tipo,
//             ID_Solomon: data.iD_Solomon,
//             Razon_Social: data.razon_Social,
//             CP: data.cp,  
//             Calle_Numero: data.calle_Numero,
//             Colonia: data.colonia,
//             Poblacion: data.poblacion,
//             Estado: data.estado,
//             RFC: data.rfc,
//             Clasificacion: data.clasificacion,
//             Telefono: data.telefono,
//             Fecha_Alta: data.fecha_Alta,
//             Ant_Compras: data.ant_Compras,
//             Limite_Credito: data.limite_Credito,
//             Ant_Pagos: data.ant_Pagos,
//             Dias_Credito: data.dias_Credito,
//             Reqquisitos_Pronto_Pago: data.reqquisitos_Pronto_Pago,
//             Descuento: data.descuento,
//             Ultima_Compra: data.ultima_Compra,
//             Ref_Bancaria: data.ref_Bancaria,
//             Observaciones: data.observaciones,
//         };
    
//         try {
//             const response = await axios.post(`${apiUrl}Proveedores/create`, transformedData);
//             console.log('Proveedor creado:', response.data);
//         } catch (error) {
//             console.error('Error al crear el proveedor:', error);
//         }
//     };
    
//     const fields = [
//         { label: 'Clave', name: 'clave', type: 'number', placeholder: 'Ingresa la clave', readonly: true },
//         { label: 'Tipo', name: 'tipo', type: 'text', placeholder: 'Ingresa el tipo', required: true },
//         { label: 'ID Solomon', name: 'iD_Solomon', type: 'number', placeholder: 'Ingresa el ID Solomon', required: true },
//         { label: 'Razón Social', name: 'razon_Social', type: 'text', placeholder: 'Ingresa la razón social', required: true },
//         { label: 'Código Postal', name: 'cp', type: 'number', placeholder: 'Ingresa el código postal', required: true },
//         { label: 'Calle y Número', name: 'calle_Numero', type: 'text', placeholder: 'Ingresa calle y número', required: true },
//         { label: 'Colonia', name: 'colonia', type: 'select', placeholder: 'Ingresa la colonia' },
//         { label: 'Población', name: 'Poblacion', type: 'text', placeholder: 'Ingresa la población', readonly: true },
//         { label: 'Estado', name: 'estado', type: 'text', placeholder: 'Ingresa el estado', readonly: true },
//         { label: 'RFC', name: 'rfc', type: 'text', placeholder: 'Ingresa el RFC', required: true },
//         { label: 'Clasificación', name: 'clasificacion', type: 'text', placeholder: 'Ingresa la clasificación', required: true },
//         { label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: 'Ingresa el teléfono', required: true },
//         { label: 'Fecha de Alta', name: 'fecha_Alta', type: 'date', required: true },
//         { label: 'Antigüedad de Compras', name: 'ant_Compras', type: 'text', placeholder: 'Ingresa la antigüedad de compras', required: false },
//         { label: 'Límite de Crédito', name: 'limite_Credito', type: 'text', placeholder: 'Ingresa el límite de crédito', required: false },
//         { label: 'Antigüedad de Pagos', name: 'ant_Pagos', type: 'text', placeholder: 'Ingresa la antigüedad de pagos', required: false },
//         { label: 'Días de Crédito', name: 'dias_Credito', type: 'number', placeholder: 'Ingresa días de crédito', required: false },
//         { label: 'Requisitos de Pronto Pago', name: 'reqquisitos_Pronto_Pago', type: 'text', placeholder: 'Ingresa requisitos de pronto pago', required: false },
//         { label: 'Descuento', name: 'descuento', type: 'text', placeholder: 'Ingresa el descuento', required: false },
//         { label: 'Última Compra', name: 'ultima_Compra', type: 'date', placeholder: 'Ingresa la última compra', required: false },
//         { label: 'Referencia Bancaria', name: 'ref_Bancaria', type: 'text', placeholder: 'Ingresa la referencia bancaria', required: false },
//         { label: 'Observaciones', name: 'observaciones', type: 'textarea', placeholder: 'Ingresa observaciones', required: false },
//     ];
    
//     return (
//         <Dialog open={true} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-[600px] max-w-full h-[80vh] overflow-auto">
//                     <FormBase fields={fields} onSubmit={handleFormSubmit} title='Crear Proveedores'/>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default Form_Proveedor;
