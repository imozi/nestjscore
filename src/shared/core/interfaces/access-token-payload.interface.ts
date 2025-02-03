import { Request } from 'express';

export interface AccessTokenPayload {
  sub: string;
  roles: string[];
}

export interface RequestWithAccessTokenPayload extends Request {
  user?: AccessTokenPayload;
}
