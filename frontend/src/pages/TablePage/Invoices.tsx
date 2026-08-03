import { useState } from "react";
import { formatCurrency, formatDate } from "../../libs/utils";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Table } from "../../components/ui/Table";
import { useTableController } from "../../features/hooks/useTableController";
import {
  useInvoices,
  useSearchInvoices,
  useFilterInvoices,
  useSendInvoicePdf,
  useUpdateInvoiceStatus,
} from "../../features/hooks/useInvoices";
import { TbFileTypePdf, TbSend } from "react-icons/tb";

const filterLabels: Record<string, string> = {
  status: "Status",
  issueDateFrom: "From Date",
  issueDateTo: "To Date",
  totalFrom: "Min Amount",
  totalTo: "Max Amount",
};

export default function Invoices() {
  const controller = useTableController({
    normalDataHook: useInvoices,
    searchDataHook: useSearchInvoices,
    filterDataHook: useFilterInvoices,
  });

  const sendPdf = useSendInvoicePdf();
  const updateStatus = useUpdateInvoiceStatus();
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSendPdf = async (invoice: any) => {
    setSendingId(invoice.id);
    try {
      await sendPdf.mutateAsync(invoice.id);
      
      // Auto update status to SENT if currently DRAFT
      if (invoice.status === "DRAFT") {
        await updateStatus.mutateAsync({
          id: invoice.id,
          status: "SENT",
        });
      }
    } finally {
      setSendingId(null);
    }
  };

  const columns = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      sortable: true,
      cell: (info: any) => (
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-medium font-mono text-xs">#{info.getValue()}</p>
            {info.row.original.isFromQuotation && (
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">
                Q
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            {info.row.original.customer?.name || "Unknown"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      sortable: true,
      cell: (info: any) => (
        <span className="text-text-secondary text-xs">
          {formatDate(info.getValue())}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      sortable: true,
      cell: (info: any) => (
        <span className="text-text-secondary text-xs">
          {info.getValue() ? formatDate(info.getValue()) : "—"}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Amount",
      sortable: true,
      cell: (info: any) => (
        <span className="font-semibold font-mono text-sm">
          {formatCurrency(Number(info.getValue()))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (info: any) => <StatusBadge status={info.getValue()} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info: any) => {
        const invoice = info.row.original;
        const isSending = sendingId === invoice.id;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleSendPdf(invoice)}
              disabled={isSending}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
                bg-brand text-white border border-border hover:bg-red-50 hover:border-red-200 hover:text-red-600
                disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send PDF to client"
            >
              {isSending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <TbFileTypePdf size={16} />
                  Send PDF
                </>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Invoices</h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage all your invoices
          </p>
        </div>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="invoice"
        searchConfig={{
          placeholder: "Search by invoice number or customer...",
        }}
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              "DRAFT",
              "SENT",
              "PARTIALLY_PAID",
              "PAID",
              "OVERDUE",
              "CANCELLED",
            ],
          },
          {
            key: "issueDateFrom",
            label: "From Date",
            type: "date",
          },
          {
            key: "issueDateTo",
            label: "To Date",
            type: "date",
          },
          {
            key: "totalFrom",
            label: "Min Amount",
            type: "text",
            placeholder: "Min amount",
          },
          {
            key: "totalTo",
            label: "Max Amount",
            type: "text",
            placeholder: "Max amount",
          },
        ]}
        filterLabels={filterLabels}
      />
    </div>
  );
}