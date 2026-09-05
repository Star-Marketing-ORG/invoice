import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceAIApi, type AIRequest } from "../api/invoiceAI.api";
import { invoiceKeys } from "./useInvoices";
import { toast } from "../../utils/toast";

export function useInvoiceAIPreview() {
  return useMutation({
    mutationFn: (data: AIRequest) => invoiceAIApi.preview(data),
  });
}

export function useInvoiceAIGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AIRequest) => invoiceAIApi.generate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      toast.success(data.message || "Invoice generated successfully");
    },
  });
}
