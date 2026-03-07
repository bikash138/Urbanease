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
import { ServiceCategory } from "@/types/admin/admin-category.types";

interface CategoriesTableProps {
  categories: ServiceCategory[];
  isLoading: boolean;
  onEdit: (id: string) => void;
}

export function CategoriesTable({
  categories,
  isLoading,
  onEdit,
}: CategoriesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && categories.length === 0 && (
            <TableLoadingRow colSpan={4} />
          )}
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-[300px] truncate">
                {category.description || "—"}
              </TableCell>
              <TableCell>
                <ActiveBadge isActive={category.isActive} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category.id)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && !isLoading && (
            <TableEmptyRow colSpan={4} message="No categories found." />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
