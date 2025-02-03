import { Worker } from 'worker_threads';
import { resolve as nodeResolve } from 'node:path';

const runWorker = async (data: string, secret: string, method: 'encrypt' | 'decrypt') => {
  return new Promise<string>((resolve, reject) => {
    const worker = new Worker(nodeResolve(__dirname, './encryptDecryptWorker.js'), {
      workerData: { data, secret, method },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};

export const encryptData = async (data: string, secret: string) => await runWorker(data, secret, 'encrypt');
export const decryptData = async (data: string, secret: string) => await runWorker(data, secret, 'decrypt');
