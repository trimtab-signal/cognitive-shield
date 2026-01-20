import { createClient } from 'redis';

let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (client) {
    return client;
  }

  client = createClient();
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  return client;
}
