import { ConflictException, Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName, isExistFile } from './lib';
import { ConfigService } from '../config';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const dir = join(process.cwd(), this.config.get('STORAGE_PATH'), file.fieldname);

          callback(null, dir);
        },
        filename: (req, file, callback) => {
          const { originalname, repl } = editFileName(file);

          file.originalname = originalname;

          return callback(null, repl);
        },
      }),
      fileFilter: async (req, file, callback) => {
        const { repl } = editFileName(file as Express.Multer.File);
        const filePath = join(process.cwd(), this.config.get('STORAGE_PATH'), file.fieldname, repl);

        const isExist = await isExistFile(filePath);

        if (isExist) {
          return callback(
            new ConflictException(`Файл ${Buffer.from(file.originalname, 'latin1').toString('utf-8')} уже существует`),
            false,
          );
        }

        callback(null, true);
      },
    };
  }
}
