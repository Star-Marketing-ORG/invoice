import { customerService } from "../customer/customer.service";
import { serviceService } from "../services/service.service";

export interface CustomerSuggestion {
  id: string;
  customerCode: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface ServiceSuggestion {
  id: string;
  serviceCode: string;
  name: string;
  price: number;
  taxRate: number;
  categoryName: string | null;
}

export class InvoiceAISuggestions {
  /**
   * Find similar customers using existing search service
   */
  async suggestCustomers(
    searchTerm: string,
    limit: number = 3,
  ): Promise<CustomerSuggestion[]> {
    const trimmed = searchTerm.trim();
    if (!trimmed) return [];

    try {
      const result = await customerService.searchCustomers({
        q: trimmed,
        limit: String(limit),
      });

      const customers = result?.data || [];

      return customers.map((customer: any) => ({
        id: customer.id,
        customerCode: customer.customerCode,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      }));
    } catch (error) {
      console.error("Failed to suggest customers:", error);
      return [];
    }
  }

  /**
   * Find similar services using existing search service
   */
  async suggestServices(
    searchTerm: string,
    limit: number = 3,
  ): Promise<ServiceSuggestion[]> {
    const trimmed = searchTerm.trim();
    if (!trimmed) return [];

    try {
      const result = await serviceService.searchServices({
        q: trimmed,
        limit: String(limit),
      });

      const services = result?.data || [];

      return services.map((service: any) => ({
        id: service.id,
        serviceCode: service.serviceCode,
        name: service.name,
        price: Number(service.price),
        taxRate: Number(service.taxRate),
        categoryName: service.category?.name || null,
      }));
    } catch (error) {
      console.error("Failed to suggest services:", error);
      return [];
    }
  }
}

export const invoiceAISuggestions = new InvoiceAISuggestions();
