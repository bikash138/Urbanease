import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ActiveBadge } from "@/components/admin/status-badge";
import {
  TableLoadingRow,
  TableEmptyRow,
} from "@/components/admin/table-states";
import { Area } from "@/types/admin/admin-area.types";

interface AreasTableProps {
  areas: Area[];
  isLoading: boolean;
  onEdit: (id: string) => void;
}

export function AreasTable({
  areas,
  isLoading,
  onEdit,
}: AreasTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && areas.length === 0 && (
            <TableLoadingRow colSpan={5} />
          )}
          {areas.map((area) => (
            <TableRow key={area.id}>
              <TableCell className="font-medium">{area.name}</TableCell>
              <TableCell>{area.city}</TableCell>
              <TableCell>{area.state}</TableCell>
              <TableCell>
                <ActiveBadge isActive={area.isActive} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(area.id)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {areas.length === 0 && !isLoading && (
            <TableEmptyRow colSpan={5} message="No service areas found." />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
