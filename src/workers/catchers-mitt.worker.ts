import { getRedisClient } from '../lib/redis';
import { analyzeMessage } from '../services/geodesic-engine';

const STREAM_KEY = 'message_stream';
const GROUP_NAME = 'catchers-mitt-group';
const CONSUMER_NAME = `consumer-${crypto.randomUUID()}`;

async function main() {
  const redis = await getRedisClient();
  
  try {
    await redis.xGroupCreate(STREAM_KEY, GROUP_NAME, '0', { MKSTREAM: true });
  } catch (e: unknown) {
    const error = e as Error;
    if (!error.message?.includes('BUSYGROUP')) {
      console.error('Error creating consumer group:', error);
      process.exit(1);
    }
  }

  console.log(`Starting worker ${CONSUMER_NAME}...`);

  while (true) {
    try {
      const response = await redis.xReadGroup(
        GROUP_NAME,
        CONSUMER_NAME,
        { key: STREAM_KEY, id: '>' },
        { COUNT: 10, BLOCK: 5000 }
      );

      if (response && Array.isArray(response)) {
        for (const streamData of response) {
          // Type guard for stream data
          if (streamData && typeof streamData === 'object' && 'messages' in streamData) {
            const stream = streamData as { name: string; messages: Array<{ id: string; message: Record<string, string> }> };
            
            if (stream.messages && Array.isArray(stream.messages)) {
              for (const message of stream.messages) {
                const messageString = message.message.message;
                const bufferedMessage = JSON.parse(messageString);

                // Catcher's Mitt Logic
                const releaseDelay = 60000; // 60 seconds
                const releaseTime = bufferedMessage.receivedAt + releaseDelay;

                if (Date.now() >= releaseTime) {
                  const processed = await analyzeMessage(bufferedMessage);
                  console.log('Processed message:', processed);
                  await redis.xAck(STREAM_KEY, GROUP_NAME, message.id);
                }
                // If not yet time to release, do nothing
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading from stream:', error);
    }
  }
}

main();
