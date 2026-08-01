import pg from "pg";
import { performance } from "node:perf_hooks";

const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_xalZi6Kuw5LN@ep-royal-recipe-ao816pzs-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15",
});

async function test() { 
  await client.connect();

  const start = performance.now();

  const result = await client.query(`
    SELECT *
    FROM "Customer"
    ORDER BY "createdAt" DESC
    LIMIT 10
  `);

  console.log(
    `Raw PostgreSQL: ${(performance.now() - start).toFixed(2)} ms`
  );
  console.log(`Rows: ${result.rows.length}`);

  await client.end();
}

test().catch(console.error);