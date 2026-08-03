import { useState } from "react";
import { TbPlus, TbFileTypePdf } from "react-icons/tb";
import { formatCurrency, formatDate } from "../../libs/utils";
import { QuotationStatusBadge } from "../../components/ui/QuotationStatusBadge";
import { Table } from "../../components/ui/Table";
import { Link } from "react-router-dom";
import { useTableController } from "../../features/hooks/useTableController";
import {
  useQuotations,
  useSearchQuotations,
  useFilterQuotations,
  useSendQuotationPdf,
  useUpdateQuotationStatus,
} from "../../features/hooks/useQuotations";
import { Button } from "../../components/ui/ButtonProps";

const filterLabels: Record<string, string> = {
  status: "Status",
  issueDateFrom: "From Date",
  issueDateTo: "To Date",
  totalFrom: "Min Amount",
  totalTo: "Max Amount",
};

export default function Quotations() {
  const controller = useTableController({
    normalDataHook: useQuotations,
    searchDataHook: useSearchQuotations,
    filterDataHook: useFilterQuotations,
  });

  const sendPdf = useSendQuotationPdf();
  const updateStatus = useUpdateQuotationStatus();
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSendPdf = async (quotation: any) => {
    setSendingId(quotation.id);
    try {
      await sendPdf.mutateAsync(quotation.id);

      // Auto update status to SENT if currently DRAFT
      if (quotation.status === "DRAFT") {
        await updateStatus.mutateAsync({
          id: quotation.id,
          status: "SENT",
        });
      }
    } finally {
      setSendingId(null);
    }
  };

  const columns = [
    {
      accessorKey: "quotationNumber",
      header: "Quotation",
      sortable: true,
      cell: (info: any) => (
        <div>
          <p className="font-medium font-mono text-xs">#{info.getValue()}</p>
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
      accessorKey: "expiryDate",
      header: "Expiry Date",
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
      cell: (info: any) => <QuotationStatusBadge status={info.getValue()} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info: any) => {
        const quotation = info.row.original;
        const isSending = sendingId === quotation.id;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleSendPdf(quotation)}
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
          <h1 className="text-2xl font-bold text-text-primary">Quotations</h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage all your quotations
          </p>
        </div>
        <Link to="/quotation/new-quotation">
          <Button variant="primary" size="sm" icon={TbPlus}>
            New Quotation
          </Button>
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="quotation"
        searchConfig={{
          placeholder: "Search by quotation number or customer...",
        }}
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED"],
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