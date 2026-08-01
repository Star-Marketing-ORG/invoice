import { performance } from "node:perf_hooks";
import { prisma } from "../../database/client"; 

export class CustomerRepository {
  async findMany() {
    const start = performance.now();

    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const end = performance.now();

    console.log(
      `Repository -> Prisma -> DB -> Repository: ${(end - start).toFixed(2)} ms`
    );

    return customers;
  }
}