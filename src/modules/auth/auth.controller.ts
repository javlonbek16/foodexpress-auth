import { Controller, Get, Post, Body, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, SentOtpDto, SignInDto, VerifyOtpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("sent-otpp")
  sentOtp(@Body() sentOtpDto: SentOtpDto) {
    return this.authService.sentOtp(sentOtpDto);
  }

  @Post("verify-otp")
  verifyOtp(@Body() verifyOtpdto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpdto);
  }

  @Post("register")
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

}
