import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
import { Button } from "@/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import axios from "axios";
import { Input } from "@/ui/input";
import { DatePicker } from "@/ui/datePicker";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/dropdown-menu";


interface DataItem {
  [key: string]: string | number;
}

interface GenericDataTableProps {
  apiUrlSearch: string;
  title: string;
  headerMappings: { [key: string]: string };
  onDelete: (id: number | string) => void; 
  textAdd: string;
  textEdit: string;
  onAdd: () => void;  
  onEdit: () => void;
}

type SortOrder = "ascn" | "desc";

function sortData(data: DataItem[], sortKey: string, reverse: boolean) {
  if (!sortKey) return data;

  const sortedData = data.sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1;
    if (a[sortKey] > b[sortKey]) return 1;
    return 0;
  });

  if (reverse) {
    return sortedData.reverse();
  }

  return sortedData;
}

function SortButton({
  sortOrder,
  columnKey,
  sortKey,
  onClick,
}: {
  sortOrder: SortOrder;
  columnKey: string;
  sortKey: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="p-0 h-4 w-4 hover:bg-transparent"
    >
      {sortKey === columnKey && sortOrder === "desc" ? (
        <ChevronDownIcon className="h-4 w-4" />
      ) : sortKey === columnKey && sortOrder === "ascn" ? (
        <ChevronUpIcon className="h-4 w-4" />
      ) : (
        <ChevronsUpDownIcon className="h-4 w-4" />
      )}
    </Button>
  );
}

export default function GenericDataTable({
  apiUrlSearch,
  headerMappings,
  onDelete,
  title,
  textAdd,
  textEdit,
  onAdd,
  onEdit 
}: GenericDataTableProps) {
  const [data, setData] = useState<DataItem[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascn");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateSearch, setDateSearch] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrlSearch, {
          params: {
            busqueda: searchTerm,
            fechaAlta: dateSearch
          },})
          console.log("Response data:", response.data);
        if (response.data.length > 0) {
          const dynamicHeaders = Object.keys(response.data[0]);
          setHeaders(dynamicHeaders);
          setVisibleColumns(dynamicHeaders); 
          setSortKey(dynamicHeaders[0]);
        }

        setData(response.data);
        setLoading(false);
      } catch (e) {
        setError(
          `Failed to fetch data: ${
            e instanceof Error ? e.message : String(e)
          }`
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrlSearch, searchTerm, dateSearch]);

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => 
      prev.includes(column) 
        ? prev.filter((c) => c !== column) 
        : [...prev, column]
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDateSearchChange = (date: Date | undefined) => {
    if (date) {
      setDateSearch(date.toISOString().split('T')[0]); 
    } else {
      setDateSearch(""); 
    }
  };

  const sortedData = React.useMemo(
    () => sortData(data, sortKey, sortOrder === "desc"),
    [data, sortKey, sortOrder]
  );

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  function changeSort(key: string) {
    setSortOrder(sortOrder === "ascn" ? "desc" : "ascn");
    setSortKey(key);
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <div>
        <div className="flex justify-center p-4">
          <p className="font-bold text-4xl">{title}</p>
        </div>
          <div className="container mx-auto py-10 justify-end flex p-2">
            <Button onClick={onAdd} className="mr-5 bg-green-400 p-6">{textAdd}</Button>
            <Button onClick={onEdit} className='bg-blue-400 p-6'>{textEdit}</Button>
          </div>
        </div>
      <div className="flex" >
      <Input
          type="text"
          placeholder="Buscar por clave..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded  w-[10%] mb-4 mr-4"
        />

        <DatePicker tilte="Fecha Alta" onChange={handleDateSearchChange}/>

        <DropdownMenu >
          <DropdownMenuTrigger asChild className="w-[20%]">
            <Button variant="outline" className="ml-auto ">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-48 overflow-y-auto">
            {headers.map((header) => (
              <DropdownMenuCheckboxItem
                key={header}
                checked={visibleColumns.includes(header)}
                onCheckedChange={() => handleColumnToggle(header)}
              >
                {headerMappings[header] || header} 
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <div className="rounded-md border">

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column}>
                {headerMappings[column] || column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
            <TableRow key={index}>
              {visibleColumns.map((column) => (
                <TableCell key={column}>{item[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
