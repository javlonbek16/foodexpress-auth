import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  RefreshTokenDto,
  RegisterDto,
  SentOtpDto,
  SignInDto,
  VerifyOtpDto,
} from './dto';
import { MailService } from 'modules/mail';
import { Repository } from 'typeorm';
import { OtpEntity, RefreshTokensEntity, UsersEntity } from '@database';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'modules/users';
import { formatWaitTime, RandomCodeGenerate } from '@utils';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokensRepository: Repository<RefreshTokensEntity>,
  ) {}

  async sentOtp(sentOtpDto: SentOtpDto) {
    const { email } = sentOtpDto;
    const existUser = await this.usersService.findOneByEmail(email);
    if (existUser) {
      throw new BadRequestException('user already exists');
    }
    const existedOtp = await this.otpRepository.findOne({ where: { email } });
    if (existedOtp) {
      const now = Date.now();
      const expires_at = new Date(existedOtp.expires_at).getTime();
      if (now < expires_at) {
        const waitSeconds = Math.ceil((expires_at - now) / 1000);
        throw new BadRequestException(
          `Please wait ${formatWaitTime(waitSeconds)} seconds before requesting a new code`,
        );
      }
    }

    const code = RandomCodeGenerate();
    const hashed_code = await bcrypt.hash(code, 7);

    await this.otpRepository.delete({ email });

    const otp = this.otpRepository.create({
      email,
      code: hashed_code,
      expires_at: new Date(Date.now() + 3 * 60 * 1000),
    });
    await this.otpRepository.save(otp);

    try {
      await this.mailService.sendVerificationCode(email, code);
    } catch (error) {
      await this.otpRepository.delete({ email });
      throw new InternalServerErrorException(
        'Tasdiqlash kodini yuborishda xatolik yuz berdi',
      );
    }

    return { message: 'Code sent successfully!' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;

    const otp = await this.otpRepository.findOne({ where: { email } });

    if (!otp) {
      throw new BadRequestException('Otp not found');
    }

    if (otp.expires_at < new Date()) {
      throw new BadRequestException('Otp code expired');
    }

    if (otp.attempts >= 5) {
      throw new BadRequestException('Try again later');
    }

    const isMatch = await bcrypt.compare(code, otp.code);

    if (!isMatch) {
      otp.attempts += 1;
      await this.otpRepository.save(otp);
      throw new BadRequestException('Invalid otp code');
    }

    await this.otpRepository.delete({ email });

    const otpToken = this.generateTokenForOtp(email);

    return { message: 'Email confirmation is successfuly', otpToken };
  }

  async register(registerDto: RegisterDto) {
    const { otpToken, ...data } = registerDto;
    const payload = this.verifyOtpToken(otpToken);

    if (payload.purpose !== 'register' || payload.email !== registerDto.email) {
      throw new BadRequestException("This email and otpToken doesn't match");
    }
    const user = await this.usersService.create(data);
    return user;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new ForbiddenException('Your account is not activated yet');
    }

    const tokens = await this.generateAccessRefreshTokens(user);

    const hashed_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.refreshTokensRepository.delete({ user_id: user.id });
    await this.refreshTokensRepository.save({
      user_id: user.id,
      hashed_token,
      expires_at: tokens.refresh_expires_at,
    });

    return {
      user_id: user.id,
      name: user.roleName.name,
      role: user.role,
      permissions: user.permissions.map((p) => ({
        id: p.id,
        code: p.code,
      })),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async getMe(id: number) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  async signOut(user_id: number) {
    const existingToken = await this.refreshTokensRepository.findOne({
      where: { user_id, revoked: false },
    });

    if (!existingToken) {
      throw new BadRequestException('token is revoked');
    }

    existingToken.revoked = true;
    await this.refreshTokensRepository.save(existingToken);

    return { message: 'Signed out successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { user_id, refresh_token } = refreshTokenDto;
    let decoded: any;
    try {
      decoded = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

    if (decoded.user_id !== user_id) {
      throw new ForbiddenException('Token does not belong to this user');
    }

    const existingToken = await this.refreshTokensRepository.findOne({
      where: { user_id, revoked: false },
    });

    if (!existingToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (existingToken.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const isMatch = await bcrypt.compare(
      refresh_token,
      existingToken.hashed_token,
    );
    if (!isMatch) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(user_id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const tokens = await this.generateAccessRefreshTokens(user);
    const hashed_token = await bcrypt.hash(tokens.refresh_token, 7);

    existingToken.hashed_token = hashed_token;
    existingToken.expires_at = tokens.refresh_expires_at;
    await this.refreshTokensRepository.save(existingToken);

    return {
      user_id: user.id,
      role: user.role,
      permissions: user.permissions.map((p) => ({
        id: p.id,
        code: p.code,
      })),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  private generateTokenForOtp(email: string) {
    return this.jwtService.sign(
      { email, purpose: 'register' },
      { secret: process.env.JWT_OTP_SECRET, expiresIn: '15m' },
    );
  }

  private verifyOtpToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_OTP_SECRET,
      });
    } catch (error) {
      throw new BadRequestException('Invalid Otp Token');
    }
  }

  async generateAccessRefreshTokens(user: any) {
    const payload = {
      user_id: user.id,
      role: user.role,
      permissions: user.permissions?.map((p: any) => ({
        id: p.id,
        code: p.code,
      })),
      iss: 'foodexpress-auth',
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ ...payload }, {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
        expiresIn: Number(process.env.JWT_ACCESS_TTL),
      } as JwtSignOptions),

      this.jwtService.signAsync({ ...payload }, {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
        expiresIn: Number(process.env.JWT_REFRESH_TTL),
      } as JwtSignOptions),
    ]);

    const refresh_expires_at = new Date(
      Date.now() + Number(process.env.JWT_REFRESH_TTL) * 1000,
    );

    return { access_token, refresh_token, refresh_expires_at };
  }
}
