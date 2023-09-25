import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin, User } from '@prisma/client';
//attaches the user to req object
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // console.log('hi');

    const user = await this.authService.validateUser(username, password);

    //  const user = await this.authService.validateAgent(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
