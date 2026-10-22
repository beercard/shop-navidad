import { createCipheriv, createDecipheriv, createHash, randomBytes, randomInt } from 'node:crypto';

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function newRedeemCode() {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length: 16 }, () => alphabet[randomInt(alphabet.length)]).join('').match(/.{1,4}/g)!.join('-');
}

function encryptionKey() {
  const key = process.env.CODE_ENCRYPTION_KEY;
  if (!key) throw new Error('CODE_ENCRYPTION_KEY is required to issue redeem codes');
  const decoded = Buffer.from(key, 'base64');
  if (decoded.length !== 32) throw new Error('CODE_ENCRYPTION_KEY must be base64-encoded 32 bytes');
  return decoded;
}

export function encryptCode(code: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(code, 'utf8'), cipher.final()]);
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${ciphertext.toString('base64url')}`;
}

export function decryptCode(encrypted: string) {
  const [iv, tag, ciphertext] = encrypted.split('.');
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString('utf8');
}

export function chooseWeighted<T extends { weight: number }>(items: T[]): T | undefined {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  if (total <= 0) return undefined;
  let choice = randomInt(total);
  for (const item of items) {
    choice -= item.weight;
    if (choice < 0) return item;
  }
  return undefined;
}
