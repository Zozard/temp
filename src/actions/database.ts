import { Client } from "pg";

export async function initDatabase(): Promise<{client: Client, close: () => Promise<void>}> {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  await client.connect();

  return {client,close:() => client.end()};
}


