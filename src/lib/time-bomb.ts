import { existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HANDSHAKE_FILE = join(__dirname, 'physical-handshake.lock');

export function verifyPhysicalHandshake(): boolean {
  if (existsSync(HANDSHAKE_FILE)) {
    const stats = statSync(HANDSHAKE_FILE);
    const now = new Date();
    const lastModified = stats.mtime;
    const diff = now.getTime() - lastModified.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days < 30;
  }
  return false;
}
