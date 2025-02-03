import { Injectable } from '@nestjs/common';
import { ConfigService as DefailtConfigService } from '@nestjs/config';
import { Leaves } from './lib/types';
import { EnvironmentVariables } from './lib/env';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: DefailtConfigService) {}

  public get<T extends Leaves<EnvironmentVariables>>(variable: T) {
    return this.configService.get(variable);
  }
}
