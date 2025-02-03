import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './prisma';
import { ConfigModule, ConfigService } from './config';
import { LoggerModule } from './logger';
import { UploadModule } from './upload';
import { JWTModule } from './jwt';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const storagePath = config.get('STORAGE_PATH');

        return [
          {
            rootPath: join(process.cwd(), storagePath),
            exclude: ['/api/(.*)'],
            serveRoot: storagePath,
          },
        ];
      },
    }),
    ConfigModule,
    LoggerModule,
    PrismaModule,
    UploadModule,
    JWTModule,
  ],
})
export class CommonModule {}
