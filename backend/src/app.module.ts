import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { DestinationsModule } from './destinations/destinations.module';
import { EventsModule } from './events/events.module';
import { PackagesModule } from './packages/packages.module';
import { OffersModule } from './offers/offers.module';
import { VisasModule } from './visas/visas.module';
import { ConfigModule } from './config/config.module';

import { AdminUser } from './admin-users/entities/admin-user.entity';
import { Configuration } from './config/entities/configuration.entity';
import { Destination } from './destinations/entities/destination.entity';
import { Event } from './events/entities/event.entity';
import { Package } from './packages/entities/package.entity';
import { Offer } from './offers/entities/offer.entity';
import { Visa } from './visas/entities/visa.entity';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'your_password',
      database: process.env.DATABASE_NAME || 'agencia_viajes',
      entities: [
        AdminUser,
        Configuration,
        Destination,
        Event,
        Package,
        Offer,
        Visa,
      ],
      synchronize: true, // Sólo para desarrollo
    }),
    AuthModule,
    AdminUsersModule,
    DestinationsModule,
    EventsModule,
    PackagesModule,
    OffersModule,
    VisasModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
