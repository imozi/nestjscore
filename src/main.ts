import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { ConfigService } from '@/app/common';
import { LoggerService } from '@/app/common';
import { LoggingInterceptor } from '@/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { RequestIdInterceptor } from './interceptors';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(LoggerService);
  const environments = app.get(ConfigService);
  const globalPrefix = environments.get('PREFIX');
  const port = environments.get('PORT');
  const cors = environments.get('CORS');
  app.use(cookieParser());

  app.enableCors({
    origin: cors,
    credentials: true,
  });

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger), new RequestIdInterceptor());
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true, transform: true }));

  app.setGlobalPrefix(globalPrefix);

  await app
    .listen(port)
    .then(() =>
      logger.info(
        `🚀 Сервер успешно запущен на порту ${port} и доступен по адресу: http://localhost:${port}/${globalPrefix}`,
      ),
    );
};

bootstrap();
