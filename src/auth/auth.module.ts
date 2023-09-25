import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { AgentsModule } from 'src/agents/agents.module';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    AgentsModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    ConfigService,
    SessionSerializer,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
