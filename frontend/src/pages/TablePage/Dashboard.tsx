import { useAuthStore } from "../../store/authStore";
import {
  useDashboardRevenue,
  useDashboardInvoiceStatus,
  useDashboardPaymentMethods,
  useDashboardStats,
  useDashboardServiceDemand,
} from "../../features/hooks/useDashboard";
import { useInvoices } from "../../features/hooks/useInvoices";
import { useCustomers } from "../../features/hooks/useCustomers";
import { useQuotations } from "../../features/hooks/useQuotations";
import Revenue from "../../components/DBComponent/Revenue";
import { Stat } from "../../components/DBComponent/Stat";
import InvoiceDashboard from "../../components/DBComponent/InvoiceDashboard";
import type { Customer, Invoice, Quotation } from "@invoice/shared/types";
import QuotationCustomer from "../../components/DBComponent/QuotationCustomer";
import InvoiceStatusChart from "../../components/DBComponent/InvoiceStatusChart";
import PaymentMethods from "../../components/DBComponent/PaymentMethods";
import ServiceDemandChart from "../../components/DBComponent/ServiceDemandChart";

export default function Dashboard() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] || "there";

  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } =
    useDashboardRevenue();
  const { data: invoiceStatusData, isLoading: invoiceStatusLoading } =
    useDashboardInvoiceStatus();
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } =
    useDashboardPaymentMethods();
  const { data: serviceDemandData, isLoading: serviceDemandLoading } =
    useDashboardServiceDemand();

  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices({
    cursor: "",
  });
  const { data: customersData, isLoading: customersLoading } = useCustomers({
    cursor: "",
  });
  const { data: quotationsData, isLoading: quotationsLoading } = useQuotations({
    cursor: "",
  });

  const recentInvoices =
    (invoicesData?.data as unknown as Invoice[])?.slice(0, 5) || [];
  const recentCustomers =
    (customersData?.data as unknown as Customer[])?.slice(0, 5) || [];
  const recentQuotations =
    (quotationsData?.data as unknown as Quotation[])?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Stat columns={2} data={statsData?.data} isLoading={statsLoading} />
        </div>
        <div className="col-span-1">
          <InvoiceDashboard
            invoices={recentInvoices}
            isLoading={invoicesLoading}
          />
        </div>
      </div>

      <Revenue data={revenueData?.data} isLoading={revenueLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <InvoiceStatusChart
          data={invoiceStatusData?.data}
          isLoading={invoiceStatusLoading}
        />
        <ServiceDemandChart
          data={serviceDemandData?.data}
          isLoading={serviceDemandLoading}
        />
      </div>

      <QuotationCustomer
        quotations={recentQuotations}
        customers={recentCustomers}
        isLoading={quotationsLoading || customersLoading}
      />

      <PaymentMethods
        data={paymentMethodsData?.data}
        isLoading={paymentMethodsLoading}
      />
    </div>
  );
}
