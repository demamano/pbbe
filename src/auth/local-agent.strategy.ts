import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalAgentStrategy extends PassportStrategy(Strategy, 'agent') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(username);
    const agent = await this.authService.validateAgent(username, password);

    if (!agent) {
      throw new UnauthorizedException();
    }

    return agent;
  }
}
