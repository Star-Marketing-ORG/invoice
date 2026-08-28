import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbSparkles,
  TbSend,
  TbX,
  TbBulb,
  TbArrowRight,
  TbUser,
  TbWallet,
  TbCalendar,
  TbFileInvoice,
  TbBuildingBank,
  TbDiscount,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import {
  useInvoiceAIPreview,
  useInvoiceAIGenerate,
} from "../../features/hooks/useInvoiceAI";
import { AIChatMessage, type ChatMessageData } from "./AIChatMessage";
import { toast } from "../../utils/toast";

const QUICK_SUGGESTIONS = [
  { icon: TbUser, text: "Invoice for Ritesh, website, 40% off" },
  { icon: TbBuildingBank, text: "Bill Acme Ltd for logo design" },
  {
    icon: TbCalendar,
    text: "Invoice for Suresh, web development, due next week",
  },
  { icon: TbDiscount, text: "Quotation for Priya, branding, 50% discount" },
];

export default function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [showExamples, setShowExamples] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
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
    setIsTyping(true);

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
      setIsTyping(false);
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
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI invoice assistant"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 border border-white/20"
      >
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center">
          <TbSparkles
            size={24}
            className="group-hover:scale-110 transition-transform"
          />
        </div>

        {/* Pulse animation */}
        <motion.div
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-2xl bg-blue-500 pointer-events-none"
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
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              role="dialog"
              aria-modal="true"
              aria-label="AI invoice assistant"
              className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-50 w-[95vw] max-w-[420px] max-h-[70vh] md:max-h-[75vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="relative px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
                >
                  <TbX size={18} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                      <TbSparkles size={20} className="text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      Invoice Ready AI Assistant
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Describe → Preview → Create Invoice
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
                {showExamples && messages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <TbBulb size={12} className="text-yellow-500" /> Try these
                      examples
                    </p>
                    {QUICK_SUGGESTIONS.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="w-full flex items-center gap-3 p-3 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all text-left group shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                          <suggestion.icon
                            size={16}
                            className="text-blue-600"
                          />
                        </div>
                        <p className="flex-1 text-sm text-gray-700 group-hover:text-blue-700 transition-colors">
                          {suggestion.text}
                        </p>
                        <TbArrowRight
                          size={14}
                          className="text-gray-400 group-hover:text-blue-600 shrink-0 transition-all group-hover:translate-x-1"
                        />
                      </motion.button>
                    ))}

                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <TbSparkles size={12} className="text-blue-600" />
                        Powered by AI - Just describe what you need
                      </p>
                    </div>
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

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-gray-400"
                  >
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200" />
                    </div>
                    AI is thinking...
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Try: "Make invoice for Ritesh, website, 40% off"'
                    rows={2}
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 border-2 border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                  <motion.button
                    onClick={handlePreview}
                    disabled={previewMutation.isPending}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send message"
                    className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 flex items-center justify-center"
                  >
                    <TbSend size={16} />
                  </motion.button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Press Enter to preview • Shift + Enter for new line
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
