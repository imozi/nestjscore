import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy } from './strategies';
import { JWTService } from './jwt.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [JWTService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  exports: [JWTService],
})
export class JWTModule {}
