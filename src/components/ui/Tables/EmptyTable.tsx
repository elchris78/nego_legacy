import { TableHead, TableRow } from "../table";

interface Props {
  length: number; // Optional prop to specify the number of columns
  label?: string; // Optional prop for a custom label
}

const EmptyTable = ({
  length,
  label = "No se encontraron resultados",
}: Props) => {
  return (
    <TableRow>
      <TableHead colSpan={length} className="text-center p-5">
        {label}
      </TableHead>
    </TableRow>
  );
};

export default EmptyTable;
