import { Injectable } from '@nestjs/common';
import { ExtendExpressMulterFile, FileTypes, formatedFiles } from './lib';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UploadService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async save(files: ExtendExpressMulterFile[], type: FileTypes, storage: string, reqId: string) {
    const transformFiles = files.map((file) => formatedFiles(file, type, storage));

    return await new Promise((res, rej) => {
      this.eventEmitter.emit(`file.uploaded.${reqId}`, transformFiles);
      this.eventEmitter.once(`file.error.${reqId}`, (error) => {
        if (error !== null) {
          rej(error);
        }
      });
      this.eventEmitter.once(`file.finish.${reqId}`, (files) => {
        res(files);
      });
    });
  }
}
