import { Prisma } from '@prisma/client';

export namespace Seed {
  export type AccountsUser = {
    roles: RolesEnum[];
    account: Prisma.AccountCreateInput;
    user: Prisma.UserCreateInput;
  };

  export enum RolesEnum {
    USER = 'user',
    MANAGER = 'manager',
    ADMIN = 'admin',
  }

  export enum RolesNameEnum {
    USER = 'Пользователь',
    MANAGER = 'Менеджер',
    ADMIN = 'Администратор',
  }

  export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
  }

  export enum GenderNameEnum {
    MALE = 'Мужской',
    FEMALE = 'Женский',
  }
}
