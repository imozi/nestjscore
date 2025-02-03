import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule as DefaultConfigModule } from '@nestjs/config';
import { validateEnvironment } from './lib';

@Global()
@Module({
  imports: [
    DefaultConfigModule.forRoot({
      validate: (config) => validateEnvironment(config),
    }),
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
