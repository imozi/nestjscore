import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAccessGuard, RolesGuard } from '@/guards';
import { RequestWithAccessTokenPayload } from '@/shared/core/interfaces';
import { Roles } from '@/decorators';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('admin')
  async findMany() {
    return await this.accountService.findMany();
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  async findByIdWithUser(@Req() { user }: RequestWithAccessTokenPayload) {
    return await this.accountService.findByIdWithUser(user.sub);
  }
}
