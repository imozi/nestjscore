import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../logger';
import { ConfigService } from '../config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    super({
      datasourceUrl: config.get('DATABASE_URL'),
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.info('👌 Подключение к базе данных прошло успешно', PrismaService.name);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
