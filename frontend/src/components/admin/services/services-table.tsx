import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ActiveBadge } from "@/components/admin/status-badge";
import {
  TableLoadingRow,
  TableEmptyRow,
} from "@/components/admin/table-states";
import { Service } from "@/types/admin/admin-service.types";

interface ServicesTableProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (id: string) => void;
}

export function ServicesTable({
  services,
  isLoading,
  onEdit,
}: ServicesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && services.length === 0 && (
            <TableLoadingRow colSpan={5} />
          )}
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {service.category?.name ?? "Unknown"}
                </span>
              </TableCell>
              <TableCell className="font-medium">
                ₹{service.basePrice.toFixed(2)}
              </TableCell>
              <TableCell>
                <ActiveBadge isActive={service.isActive} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(service.id)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {services.length === 0 && !isLoading && (
            <TableEmptyRow colSpan={5} message="No services found." />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
