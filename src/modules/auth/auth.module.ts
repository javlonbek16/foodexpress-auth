import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from 'modules/mail';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity, RefreshTokensEntity } from '@database';
import { UsersModule } from 'modules/users';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([OtpEntity, RefreshTokensEntity]),
    MailModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
