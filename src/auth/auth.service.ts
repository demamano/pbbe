import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenDto } from 'src/dto/auth.dto';
import { Response } from 'express';
import { Role } from '@prisma/client';
import { UpdateAdminDto } from 'src/dto/admin-update.dto';
import { Admin } from 'src/dto/admin.dto';
import { AgentsService } from 'src/agents/agents.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private agentsService: AgentsService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findUserByUsername(username: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      return null;
    }

    return user;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.hashedPassword);
    if (!isMatch) {
      return null;
    }
    const { hashedPassword, ...result } = user;
    return result;
  }

  async login(user: Admin): Promise<AuthTokenDto> {
    const foundUser = await this.usersService.findOne(user.username);
    if (foundUser) {
      const tokens = await this.getTokens(user.username, foundUser.id);
      await this.updateRefreshToken(user.username, tokens.refreshToken);
      return tokens;
    }
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  async logout(username: string) {
    await this.usersService.findAndUpdateUser(
      username,
      Object.assign(new UpdateAdminDto(), { refreshToken: null }),
    );
  }
  async getTokens(username: string, id: string): Promise<AuthTokenDto> {
    const tokens = await Promise.all([
      this.jwtService.signAsync(
        {
          username,
          id,
        },
        {
          secret: this.configService.get<string>('secret'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          username,
          id,
        },
        {
          secret: this.configService.get<string>('refresh_secret'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }
  async refreshTokens(username: string, refreshToken: string) {
    const user = await this.usersService.findOne(username);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.username, user.role);
    await this.updateRefreshToken(user.username, tokens.refreshToken);
    return tokens;
  }
  async updateRefreshToken(username: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.findAndUpdateUser(
      username,
      Object.assign(new UpdateAdminDto(), {
        refreshToken: hashedRefreshToken,
      }),
    );
  }

  storeTokenInCookie(res: Response, authToken: AuthTokenDto) {
    res.cookie('access_token', authToken.accessToken, {
      maxAge: 1000 * 60 * 15,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    res.cookie('refresh_token', authToken.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }

  async validateAgent(username: string, pass: string): Promise<any> {
    const user = await this.agentsService.findOne(username);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.hashedPassword);
    if (!isMatch) {
      return null;
    }
    const { hashedPassword, ...result } = user;
    return result;
  }
}
