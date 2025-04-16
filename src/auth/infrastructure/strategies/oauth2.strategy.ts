import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor() {
    super({
      authorizationURL: 'https://oauth-provider.com/auth',
      tokenURL: 'https://oauth-provider.com/token',
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_SECRET,
      callbackURL: '/auth/oauth/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
      state: true,
    });
  }

  async validate(access_token: string, refreshToken: string, profile: any) {
    return { access_token, profile };
  }
}