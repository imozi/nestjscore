import { PrismaService } from '@/app/common';
import { BasePostgresRepository } from '@/shared/data-access';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionTokenRepository extends BasePostgresRepository<'SessionToken'> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'sessionToken');
  }

  async findUniqueWithAccountRole(deviceId: string) {
    return await this.prisma.sessionToken.findUnique({
      where: { deviceId },
      include: {
        sessions: {
          include: {
            account: {
              include: {
                roles: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
