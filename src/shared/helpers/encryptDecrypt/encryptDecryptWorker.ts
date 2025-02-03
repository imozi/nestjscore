import { parentPort, workerData } from 'node:worker_threads';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const { data, secret, method } = workerData;

const encryptData = (data: string, secret: string) => {
  const secretToBuffer = Buffer.from(secret, 'base64');
  if (secretToBuffer.length !== 32) {
    throw new Error('Secret key must be 32 bytes for AES-256-GCM.');
  }

  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', secretToBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${encrypted.toString('base64')}:${authTag.toString('base64')}`;
};

const decryptData = (data: string, secret: string) => {
  const secretToBuffer = Buffer.from(secret, 'base64');
  if (secretToBuffer.length !== 32) {
    throw new Error('Secret key must be 32 bytes for AES-256-GCM.');
  }

  const [ivHex, encryptedData, authTagHex] = data.split(':');
  if (!ivHex || !encryptedData || !authTagHex) {
    throw new Error('Invalid input format. Expected format: iv:encryptedData:authTag');
  }

  const iv = Buffer.from(ivHex, 'base64');
  const authTag = Buffer.from(authTagHex, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', secretToBuffer, iv);
  decipher.setAuthTag(authTag);

  try {
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'base64')), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error(`Decryption failed. Invalid authentication tag or corrupted data. ${error}`);
  }
};

switch (true) {
  case method === 'encrypt':
    parentPort.postMessage(encryptData(data, secret));
    break;
  case method === 'decrypt':
    parentPort.postMessage(decryptData(data, secret));
    break;
}
