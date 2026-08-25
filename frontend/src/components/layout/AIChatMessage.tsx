import { motion } from "framer-motion";
import {
  TbFileInvoice,
  TbUserPlus,
  TbFilter2Plus,
  TbAlertTriangle,
  TbCheck,
  TbSparkles,
} from "react-icons/tb";
import type { InvoiceAIPreview } from "../../features/api/invoiceAI.api";

export type ChatErrorType = "CUSTOMER_NOT_FOUND" | "SERVICE_NOT_FOUND" | "INVALID_INPUT";

export interface ChatMessageData {
  id: string;
  type: "user" | "ai";
  text: string;
  preview?: InvoiceAIPreview;
  error?: {
    message: string;
    type: ChatErrorType;
    customerName?: string;
    serviceNames?: string[];
  };
  isThinking?: boolean;
}

interface AIChatMessageProps {
  message: ChatMessageData;
  onCreateCustomer: (name: string) => void;
  onCreateService: (name: string) => void;
  onConfirmInvoice: () => void;
  isGenerating: boolean;
}

export function AIChatMessage({
  message,
  onCreateCustomer,
  onCreateService,
  onConfirmInvoice,
  isGenerating,
}: AIChatMessageProps) {
  
  // User Message
  if (message.type === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] px-4 py-2.5 bg-brand text-white rounded-2xl rounded-br-md text-sm">
          {message.text}
        </div>
      </motion.div>
    );
  }

  // AI Thinking
  if (message.isThinking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-hover rounded-2xl rounded-bl-md">
          <TbSparkles size={16} className="text-brand animate-pulse" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                className="w-2 h-2 rounded-full bg-brand"
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // AI Error
  if (message.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="max-w-[90%] bg-white border border-border rounded-2xl rounded-bl-md overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <TbAlertTriangle size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {message.error.message}
                </p>

                {message.error.type === "CUSTOMER_NOT_FOUND" && (
                  <button
                    onClick={() => onCreateCustomer(message.error!.customerName!)}
                    className="mt-3 w-full px-3 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <TbUserPlus size={14} />
                    Create "{message.error.customerName}"
                  </button>
                )}

                {message.error.type === "SERVICE_NOT_FOUND" && (
                  <div className="mt-3 space-y-2">
                    {message.error.serviceNames?.map((service, index) => (
                      <button
                        key={index}
                        onClick={() => onCreateService(service)}
                        className="w-full px-3 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-1.5"
                      >
                        <TbFilter2Plus size={14} />
                        Create "{service}"
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // AI Preview
  if (message.preview) {
    const { invoice } = message.preview;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="max-w-[90%] bg-white border border-border rounded-2xl rounded-bl-md overflow-hidden">
          {/* Preview Header */}
          <div className="px-4 py-3 bg-surface-hover border-b border-border flex items-center gap-2">
            <TbFileInvoice size={14} className="text-brand" />
            <span className="text-xs font-semibold text-text-primary">Invoice Preview</span>
          </div>

          <div className="p-4 space-y-3">
            {/* Customer */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-bold">
                {invoice.customer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{invoice.customer.name}</p>
                {invoice.customer.email && (
                  <p className="text-xs text-text-muted">{invoice.customer.email}</p>
                )}
              </div>
              <TbCheck size={16} className="text-success" />
            </div>

            {/* Items */}
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div key={index} className="p-2.5 bg-surface-hover rounded-xl">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Qty {item.quantity}
                        {Number(item.discount) > 0 && ` · ${item.discount}% off`}
                      </p>
                    </div>
                    <p className="text-xs font-semibold font-mono text-text-primary shrink-0">
                      ₹{item.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Subtotal</span>
                <span className="font-mono">₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-xs text-danger">
                  <span>Discount</span>
                  <span className="font-mono">-₹{invoice.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-text-muted">
                <span>Tax</span>
                <span className="font-mono">₹{invoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-1.5">
                <span className="text-text-primary">Total</span>
                <span className="font-mono text-brand">₹{invoice.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Warnings */}
            {message.preview.warnings.length > 0 && (
              <div className="flex gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <TbAlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  {message.preview.warnings.map((warning, index) => (
                    <p key={index} className="text-xs text-amber-700 leading-snug">{warning}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={onConfirmInvoice}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-brand text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Creating…" : "Confirm & Create Invoice"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default AI Text
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="px-4 py-2.5 bg-surface-hover text-text-primary rounded-2xl rounded-bl-md text-sm">
        {message.text}
      </div>
    </motion.div>
  );
}