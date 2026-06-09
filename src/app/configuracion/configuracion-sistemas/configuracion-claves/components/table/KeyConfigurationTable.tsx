import { CircleEllipsisIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import KeyConfigurationTableRow from "./KeyConfigurationTableRow";
import TableLoader from "@/components/ui/Tables/TableLoader";
import EmptyTable from "@/components/ui/Tables/EmptyTable";

import type { KeyConfiguration } from "../../services/keyConfigurationTypes";

interface Props {
  keyConfiguration: KeyConfiguration[] | null;
  startIndex: number;
  isLoading?: boolean;
}

const tableHeaders = [
  "#",
  "Modulo",
  "Catálogo",
  "Tipo Clave",
  "Tipo de prefijo",
  "Prefijo",
];

const KeyConfigurationTable = ({
  keyConfiguration,
  startIndex,
  isLoading,
}: Props) => {
  return (
    <div className="p-5">
      <Table className="border-[5px] border-solid border-[#EDEDED]">
        <TableHeader className="bg-[#EDEDED]">
          <TableRow className="p-5">
            {tableHeaders.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead className="flex justify-center items-center">
              <CircleEllipsisIcon />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoader length={tableHeaders.length + 1} />
          ) : keyConfiguration && keyConfiguration.length > 0 ? (
            keyConfiguration.map((keyConfiguration, index) => (
              <KeyConfigurationTableRow
                key={keyConfiguration.uidConfiguration}
                index={index}
                keyConfiguration={keyConfiguration}
                startIndex={startIndex}
              />
            ))
          ) : (
            <EmptyTable length={tableHeaders.length + 1} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default KeyConfigurationTable;
