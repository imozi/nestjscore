import { Request } from 'express';

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
}

export interface RequestWithRefreshTokenPayload extends Request {
  user?: RefreshTokenPayload;
}
