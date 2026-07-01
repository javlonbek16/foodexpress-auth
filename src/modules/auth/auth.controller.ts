import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RefreshTokenDto,
  RegisterDto,
  SentOtpDto,
  SignInDto,
  VerifyOtpDto,
} from './dto';
import { CurrentUser, JwtAuthGuard } from '@common';
import { UsersEntity } from '@database';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sent-otp')
  sentOtp(@Body() sentOtpDto: SentOtpDto) {
    return this.authService.sentOtp(sentOtpDto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpdto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpdto);
  }

  @Post('register')
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() currentUser: any) {
    return this.authService.getMe(currentUser.user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  signout(@CurrentUser() user: UsersEntity) {
    return this.authService.signOut(user.id);
  }

  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
