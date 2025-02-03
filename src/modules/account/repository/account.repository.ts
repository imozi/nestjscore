import { PrismaService } from '@/app/common';
import { BasePostgresRepository } from '@/shared/data-access';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository extends BasePostgresRepository<'Account'> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'account');
  }

  async findByEmailOrShortcut(emailOrShortcut: string) {
    return await this.prisma.account.findFirst({
      where: {
        OR: [
          {
            shortcut: emailOrShortcut,
          },
          {
            email: emailOrShortcut,
          },
        ],
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findByIdWithUser(id: string) {
    return await this.prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        shortcut: true,
        roles: {
          select: {
            name: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            patronymic: true,
            fullName: true,
            age: true,
            gender: {
              select: {
                description: true,
              },
            },
            birthday: true,
            avatar: true,
          },
        },
      },
    });
  }
}
