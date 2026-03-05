import { Loader2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableLoadingRowProps {
  colSpan: number;
}

export function TableLoadingRow({ colSpan }: TableLoadingRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </TableCell>
    </TableRow>
  );
}

interface TableEmptyRowProps {
  colSpan: number;
  message?: string;
}

export function TableEmptyRow({
  colSpan,
  message = "No records found.",
}: TableEmptyRowProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
