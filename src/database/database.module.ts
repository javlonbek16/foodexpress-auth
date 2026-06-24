import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from 'config/db.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        type: 'postgres',
        host: dbConfig.DB_HOST,
        port: dbConfig.DB_PORT,
        username: dbConfig.DB_USERNAME,
        password: dbConfig.DB_PASSWORD,
        database: dbConfig.DB_NAME,
        synchronize: true,
        autoLoadEntities: true,

        // Pool configuration
        extra: {
          max: 40,
          min: 4,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 3000,
          statement_timeout: 10000,
        },

        // Logging configuration
        logging: ['query', 'warn', 'error'],
        logger: 'advanced-console',
      }),
    }),
  ],
})
export class DatabaseModule {}
