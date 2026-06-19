import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'modules/auth';
import { CouriersModule } from 'modules/couriers';
import { CustomersModule } from 'modules/customers';
import { PermissionsModule } from 'modules/permissions';
import { RestaurantOwnersModule } from 'modules/restaurant_owners';
import { RolesModule } from 'modules/roles';
import { UsersModule } from 'modules/users';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    AuthModule,
    CustomersModule,
    CouriersModule,
    RestaurantOwnersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
