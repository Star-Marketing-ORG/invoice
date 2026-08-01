import { performance } from "perf_hooks";
import { prisma } from "../../database/client";

export class CustomerRepository {

  async findMany() {
      console.log("🔥 CustomerRepository.findMany called");
  const start = performance.now();

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  const end = performance.now();

  console.log(
    `Repository -> DB: ${(end - start).toFixed(2)} ms`
  );

  return customers;
}

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
    });
  }

  async findByCustomerCode(customerCode: string) {
    return prisma.customer.findUnique({
      where: { customerCode },
    });
  }

  async findByEmail(email: string) {
    return prisma.customer.findFirst({
      where: { email },
    });
  }

  async findByPhone(phone: string) {
    return prisma.customer.findFirst({
      where: { phone },
    });
  }

  async create(data: {
    customerCode: string;
    name: string;
    email?: string;
    phone: string;
    address?: string;
    gstNumber?: string;
    notes?: string;
  }) {
    return prisma.customer.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      gstNumber?: string;
      notes?: string;
    },
  ) {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.customer.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.customer.count();
  }

  async search(args: any) {
    return prisma.customer.findMany({
      ...args,
      include: {
        _count: {
          select: {
            quotations: true,
            invoices: true,
          },
        },
      },
    });
  }

  async filter(args: any) {
    return prisma.customer.findMany({
      ...args,
      include: {
        _count: {
          select: {
            quotations: true,
            invoices: true,
          },
        },
      },
    });
  }
}

export const customerRepository = new CustomerRepository();
