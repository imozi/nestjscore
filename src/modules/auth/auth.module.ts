import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountModule } from '../account';
import { SessionModule } from '../session';
import { SessionTokenRepository } from './repository';

@Module({
  imports: [AccountModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService, SessionTokenRepository],
})
export class AuthModule {}
