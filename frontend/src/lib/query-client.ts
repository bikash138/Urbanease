import { QueryClient, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

const mutationCache = new MutationCache({
  onSuccess: (data: unknown) => {
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: string }).message;
      if (message) toast.success(message);
    }
  },
  onError: (error: { message: string }) => {
    console.error(error);
    toast.error(error.message);
  },
});

export const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
