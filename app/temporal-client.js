import { Connection, Client } from '@temporalio/client';

export async function temporalClient() {
  const connection = await Connection.connect();
  const client = new Client({ connection });

  return client;
}