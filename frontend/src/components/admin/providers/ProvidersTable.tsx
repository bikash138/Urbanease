import { Eye, CheckCircle, XCircle } from "lucide-react";
import type { ProviderProfile } from "@/types/admin/admin-provider.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProviderStatusBadge } from "@/components/admin/status-badge";
import {
  TableLoadingRow,
  TableEmptyRow,
} from "@/components/admin/table-states";
import { formatProviderDate } from "./utils";

interface ProvidersTableProps {
  providers: ProviderProfile[];
  isLoading: boolean;
  isMutating: boolean;
  onViewDetails: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (provider: ProviderProfile) => void;
}

export function ProvidersTable({
  providers,
  isLoading,
  isMutating,
  onViewDetails,
  onApprove,
  onReject,
}: ProvidersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && providers.length === 0 && (
            <TableLoadingRow colSpan={7} />
          )}
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell className="font-medium">
                {provider.user.name}
              </TableCell>
              <TableCell>{provider.user.email}</TableCell>
              <TableCell>{provider.user.phone ?? "—"}</TableCell>
              <TableCell>
                {provider.experience}{" "}
                {provider.experience === 1 ? "year" : "years"}
              </TableCell>
              <TableCell>
                <ProviderStatusBadge status={provider.status} />
              </TableCell>
              <TableCell>{formatProviderDate(provider.createdAt)}</TableCell>
              <TableCell className="text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  title="View details"
                  onClick={() => onViewDetails(provider.id)}
                  disabled={isLoading}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {provider.status === "PENDING" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Approve"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => onApprove(provider.id)}
                      disabled={isMutating}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Reject"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => onReject(provider)}
                      disabled={isMutating}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          {providers.length === 0 && !isLoading && (
            <TableEmptyRow colSpan={7} message="No providers found." />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
