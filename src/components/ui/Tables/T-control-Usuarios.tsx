import React, { useState } from 'react';
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Image from 'next/image';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Grid, Typography } from '@mui/material';


interface TablaControlUsuariosProps {
  title: string;
  selectOptions: Array<{ placeholder: string; options: Array<{ label: string, value: string }> }>;
  tableHeaders: string[];
  tableData: Array<Record<string, any>>;
  actions?: (rowData: any) => JSX.Element;
  isUserDeleted?: boolean;
}

const TablaControlUsuarios: React.FC<TablaControlUsuariosProps> = ({ 
  title, 
  selectOptions, 
  tableHeaders, 
  tableData, 
  actions,
  isUserDeleted
}) => {
  const itemsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(1); 
  const router = useRouter();

  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tableData.length / itemsPerPage); 

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const addUser = () => {
    router.push('/configuracion/configuracion-sistemas/control-usuarios/usuarios/crear-usuario');
  }


  return (
    <>
      <div className='p-5'>
        <h1 className="text-2xl font-bold ">{title}</h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-end ">
          {selectOptions.map((select, idx) => (
            <Select key={idx}>
              <SelectTrigger className="w-full sm:w-[260px] lg:w-[180px] xl:w-[280px]">
                <SelectValue placeholder={select.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {select.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          <div className="relative w-full sm:w-[260px] lg:w-[180px] xl:w-[280]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input className="pl-8 bg-white w-full" placeholder="Buscar..." />
          </div>
          <Button className="w-full h-11 sm:w-[260px] lg:w-[180px] xl:w-[280px] bg-[#3C98CB]" onClick={addUser}>
            <Plus className="mr-2 h-4 w-4" /> Crear nuevo usuario
          </Button>
        </div>
      </div>
      
      <div className='h-[60vh] p-5 sm:h-[60vh] overflow-auto'>
        <Table className='border-[5px] border-solid border-[#EDEDED]'>
          <TableHeader className='bg-[#EDEDED]'>
            <TableRow className='p-5'>
              {tableHeaders.map((header, idx) => (
                <TableHead key={idx} className="border-r border-[#EDEDED]">{header}</TableHead>
              ))}
              {actions && <TableHead className="border-r border-[#EDEDED]">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((rowData, rowIndex) => (
              <TableRow key={rowIndex}>
                {tableHeaders.map((header) => (
                  <TableCell key={header} className="border-r border-[#EDEDED]">{rowData[header.toLowerCase()]}</TableCell>
                ))}
                {actions && <TableCell className="border-r border-[#EDEDED]">{actions(rowData)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Box className="p-5 mt-5">
      <Grid container spacing={1} alignItems="center">
        {/* Sección de usuarios registrados */}
        <Grid item xs={12} sm={6} md={4} lg={2.5} xl={3}>
          <Box className="text-sm font-bold rounded-md bg-[#EDEDED] h-12 flex justify-center items-center p-2 w-full">
            <Typography variant="body1">
              Usuarios registrados: {tableData.length}
            </Typography>
          </Box>
        </Grid>

        {/* Sección de paginación */}
        <Grid item xs={12} sm={6} md={4} lg={2.5} xl={3}>
          <Box className=" h-12 rounded-md flex items-center border-[3px] border-[#EDEDED]">
            <Grid container spacing={0} alignItems="center" >
              <Grid item xs={4} lg={4} display={'flex'} justifyContent={'start'}>
                <Button  
                  className='p-6 bg-[#EDEDED]'
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                >
                  <NavigateBeforeIcon color='action'/>
                </Button>
              </Grid>
              <Grid item xs={4} lg={4}>
                <Typography variant="body2" align="center">
                  {currentPage} de {totalPages}
                </Typography>
              </Grid>
              <Grid item xs={4} lg={4} display={'flex'} justifyContent={'end'}>
                <Button 
                  className='p-6 bg-[#EDEDED]'
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                >
                  <NavigateNextIcon color='action'/>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
      {isUserDeleted && (
          <div className="bg-[#318F41] text-white p-3 flex items-center space-x-4">
            <CheckCircleOutlineIcon sx={{ color: '#FFFFFF' }}/>
            <p>Usuario eliminado correctamente.</p>
          </div>
        )}
    </>
  );
};

export default TablaControlUsuarios;