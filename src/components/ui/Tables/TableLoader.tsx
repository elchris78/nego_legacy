import ReactLoading from "react-loading";
import { TableHead, TableRow } from "../table";

interface Props {
  length: number; // Optional prop to specify the number of columns
}

const TableLoader = ({ length }: Props) => {
  return (
    <TableRow>
      <TableHead colSpan={length} className="p-5">
        <ReactLoading
          className="mx-auto"
          type="spinningBubbles"
          color="gray"
          height={50}
          width={50}
        />
      </TableHead>
    </TableRow>
  );
};

export default TableLoader;
