import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RefreshAuthGuard } from './refresh-auth.guard';
import { Response as ResponseType } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //all the endpoints are for the admin entity

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() body,
    @Req() req,
    @Res({ passthrough: true }) res: ResponseType,
  ): Promise<void> {
    const authToken = await this.authService.login(req.user);
    // res.json(req.user);
   this.authService.storeTokenInCookie(res, authToken);
    res.status(201).send({ message: 'ok' });
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    res.clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0),
    });
    res.clearCookie('refresh_token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0),
    });
    this.authService.logout(req.user.username);

    return {
      message: 'logged out successfully',
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const refreshToken = req.cookies.refresh_token;
    const newAuthToken = await this.authService.refreshTokens(
      req.user?.username,
      refreshToken,
    );
    this.authService.storeTokenInCookie(res, newAuthToken);
    res.status(200).send({ message: 'ok' });
    return;
  }
}
