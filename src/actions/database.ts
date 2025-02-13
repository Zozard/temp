import { Client } from "pg";

export async function initDatabase(): Promise<Client> {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  await client.connect();

  return client;
}


