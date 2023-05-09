import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    let synchronize = true;
    if (process.env.DB_SYNC) {
      synchronize = process.env.DB_SYNC == 'false' ? false : true;
    }

    let dropSchema = false;
    if (process.env.DB_DROP_SCHEMA) {
      dropSchema = process.env.DB_DROP_SCHEMA == 'true' ? true : false;
    }

    let logging = false;
    if (process.env.DB_LOGGING) {
      logging = process.env.DB_LOGGING == 'true' ? true : false;
    }

    let autoLoadEntities = true;
    if (process.env.DB_AUTOLOAD_ENTITIES) {
      autoLoadEntities =
        process.env.DB_AUTOLOAD_ENTITIES == 'false' ? false : true;
    }
    return {
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: synchronize,
      dropSchema: dropSchema,
      logging: logging,
      autoLoadEntities: autoLoadEntities,
      entities: ['dist/**/*.entity.ts', 'dist/**/**/*.entity.ts'],
    };
  }
}
