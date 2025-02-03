import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async findMany() {
    return await this.accountRepository.findMany();
  }

  async findById(uuid: string) {
    return await this.accountRepository.findById(uuid);
  }

  async findByEmailOrShortcut(emailOrShortcut: string) {
    return await this.accountRepository.findByEmailOrShortcut(emailOrShortcut);
  }

  async findByIdWithUser(uuid: string) {
    return await this.accountRepository.findByIdWithUser(uuid);
  }
}
