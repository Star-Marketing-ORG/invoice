import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceAIApi } from "../api/invoiceAI.api";
import { invoiceKeys } from "./useInvoices";
import { toast } from "../../utils/toast";

export function useInvoiceAIPreview() {
  return useMutation({
    mutationFn: (text: string) => invoiceAIApi.preview(text),
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to preview invoice";
      const details = error.response?.data?.details;
      
      toast.error(message);
      
      // Return error details for frontend to handle
      return {
        message,
        details,
      };
    },
  });
}

export function useInvoiceAIGenerate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (text: string) => invoiceAIApi.generate(text),
    onSuccess: (data) => {
      // Invalidate invoice list cache
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      toast.success(data.message || "Invoice generated successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to generate invoice";
      const details = error.response?.data?.details;
      
      toast.error(message);
      
      return {
        message,
        details,
      };
    },
  });
}