import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbSparkles, TbSend, TbX, TbBulb, TbArrowRight } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import {
  useInvoiceAIPreview,
  useInvoiceAIGenerate,
} from "../../features/hooks/useInvoiceAI";
import { AIChatMessage, type ChatMessageData } from "./AIChatMessage";
import { toast } from "../../utils/toast";

const QUICK_SUGGESTIONS = [
  { icon: "👤", text: "Invoice for Ritesh, website, 40% off" },
  { icon: "💰", text: "Bill Acme Ltd for logo design" },
  { icon: "📅", text: "Invoice for Suresh, web development, due next week" },
];

export default function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [showExamples, setShowExamples] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const previewMutation = useInvoiceAIPreview();
  const generateMutation = useInvoiceAIGenerate();

  const isCreating = generateMutation.isPending;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePreview = async () => {
    if (!text.trim()) return;

    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      type: "user",
      text: text,
    };

    const thinkingMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      type: "ai",
      text: "",
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setShowExamples(false);

    try {
      const result = await previewMutation.mutateAsync(text);

      // Replace thinking with preview
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingMessage.id
            ? {
                id: msg.id,
                type: "ai",
                text: "",
                preview: result.data,
              }
            : msg,
        ),
      );
    } catch (error: any) {
      const details = error.response?.data?.details;
      const message = error.response?.data?.message || "Something went wrong";

      let errorData: ChatMessageData["error"] = {
        message,
        type: "INVALID_INPUT",
      };

      if (details?.suggestedCustomers) {
        errorData = {
          message: `Customer not found. Did you mean one of these?`,
          type: "CUSTOMER_NOT_FOUND",
          customerName: message.match(/"([^"]+)"/)?.[1] || "Unknown",
        };
      } else if (details?.unmatchedServices) {
        errorData = {
          message: "Some services not found",
          type: "SERVICE_NOT_FOUND",
          serviceNames: details.unmatchedServices.map((s: any) => s.requested),
        };
      }

      // Replace thinking with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingMessage.id
            ? {
                id: msg.id,
                type: "ai",
                text: "",
                error: errorData,
              }
            : msg,
        ),
      );
    } finally {
      setText("");
    }
  };

  const handleGenerate = async () => {
    // Get the last user message text
    const lastUserMessage = messages
      .filter((m) => m.type === "user")
      .pop()?.text;

    if (!lastUserMessage) return;

    try {
      const result = await generateMutation.mutateAsync(lastUserMessage);

      // Close modal
      setIsOpen(false);
      setMessages([]);
      setShowExamples(true);
      setText("");

      // Redirect to created invoice
      const invoiceId = result.data.invoice.id;
      if (invoiceId) {
        navigate(`/invoice/${invoiceId}`);
      } else {
        toast.success("Invoice created successfully!");
        navigate("/invoices");
      }
    } catch (error: any) {
      console.error("Generate error:", error);
      // Show error in chat
      const errorMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        type: "ai",
        text: "",
        error: {
          message: error.response?.data?.message || "Failed to create invoice",
          type: "INVALID_INPUT",
        },
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePreview();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
    setShowExamples(false);
    inputRef.current?.focus();
  };

  const goToCreateCustomer = (name: string) => {
    setIsOpen(false);
    navigate("/customers/new", { state: { name } });
  };

  const goToCreateService = (name: string) => {
    setIsOpen(false);
    navigate("/services/new", { state: { name } });
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI invoice assistant"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-xl shadow-brand/25 hover:shadow-brand/40 transition-shadow cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
      >
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center">
          <TbSparkles size={26} />
        </div>

        <motion.div
          initial={{ scale: 1, opacity: 0.35 }}
          animate={{ scale: [1, 1.4], opacity: [0.25, 0] }}
          transition={{
            duration: 1.8,
            repeat: 2,
            repeatDelay: 0.4,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full bg-brand pointer-events-none"
        />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label="AI invoice assistant"
              className="fixed bottom-28 right-8 z-50 w-[440px] max-w-[calc(100vw-2rem)] max-h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-border"
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand/5 via-transparent to-transparent shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  <TbX size={18} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg shadow-brand/20">
                      <TbSparkles size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary leading-tight">
                      AI Invoice Assistant
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Describe it, review it, create it
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {showExamples && messages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1">
                      <TbBulb size={12} /> Quick Examples
                    </p>
                    {QUICK_SUGGESTIONS.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="w-full flex items-center gap-3 p-3 bg-surface-hover hover:bg-brand/5 rounded-xl border border-transparent hover:border-brand/20 transition-all text-left group"
                      >
                        <span className="text-lg">{suggestion.icon}</span>
                        <p className="flex-1 text-sm text-text-primary truncate group-hover:text-brand transition-colors">
                          {suggestion.text}
                        </p>
                        <TbArrowRight
                          size={14}
                          className="text-text-muted group-hover:text-brand shrink-0 transition-all group-hover:translate-x-0.5"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((message) => (
                  <AIChatMessage
                    key={message.id}
                    message={message}
                    onCreateCustomer={goToCreateCustomer}
                    onCreateService={goToCreateService}
                    onConfirmInvoice={handleGenerate}
                    isGenerating={isCreating}
                  />
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border shrink-0">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Try: "Make invoice for Ritesh, website, 40% off"'
                    rows={2}
                    className="w-full px-4 py-3 pr-12 bg-surface-hover rounded-2xl text-sm text-text-primary placeholder:text-text-muted border-2 border-transparent focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                  />
                  <button
                    onClick={handlePreview}
                    disabled={previewMutation.isPending}
                    aria-label="Send message"
                    className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <TbSend size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
