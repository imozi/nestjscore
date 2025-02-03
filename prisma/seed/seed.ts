import { PrismaClient } from '@prisma/client';
import { Roles, Genders, AccountsUser } from './data';

class PrismaSeed {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async clearData() {
    return await this.prisma.$transaction([
      this.prisma.role.deleteMany(),
      this.prisma.gender.deleteMany(),
      this.prisma.account.deleteMany(),
      this.prisma.user.deleteMany(),
      this.prisma.settings.deleteMany(),
    ]);
  }

  async init() {
    try {
      await this.clearData();

      await this.prisma.$transaction([
        this.prisma.role.createManyAndReturn({ data: Roles }),
        this.prisma.gender.createManyAndReturn({ data: Genders }),
      ]);

      for (const accountUser of AccountsUser) {
        const account = await this.prisma.account.create({
          data: {
            ...accountUser.account,
            roles: {
              connect: accountUser.roles.map((role) => ({ name: role })),
            },
          },
          include: {
            user: true,
          },
        });

        await this.prisma.user.update({
          where: {
            id: account.user?.id,
          },
          data: {
            ...accountUser.user,
          },
        });
      }

      await this.prisma.$disconnect();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

const prismaSeed = new PrismaSeed();
prismaSeed.init();
