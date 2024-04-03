import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config, ConfigurationOptions } from 'aws-sdk';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('CLIENT_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, refreshToken, Cache, Authorization',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '15mb' }));

  const awsConfig: ConfigurationOptions = {
    accessKeyId: configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: configService.get('AWS_SECRET_KEY'),
    region: configService.get('AWS_REGION'),
  };

  if (configService.get('NODE_ENV') === 'development') awsConfig.sessionToken = configService.get('AWS_SESSION_TOKEN');
  config.update(awsConfig);
  await app.listen(configService.get('PORT'));
}
bootstrap();
