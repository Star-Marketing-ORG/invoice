import axiosInstance from "../../utils/axios";

export const dashboardApi = {
  getStats: () =>
    axiosInstance.get("/dashboard/stat").then((res) => res.data),

  getRevenue: () =>
    axiosInstance.get("/dashboard/invoice-revenue").then((res) => res.data),

  getInvoiceStatus: () =>
    axiosInstance.get("/dashboard/invoice-status").then((res) => res.data),

  getPaymentMethods: () =>
    axiosInstance.get("/dashboard/payment-methods").then((res) => res.data),

  getServiceDemand: () =>
    axiosInstance.get("/dashboard/service-demand").then((res) => res.data),
};