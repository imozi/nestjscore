import { PrismaService } from '@/app/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseRepository } from '../core/interfaces';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ReturnTypeMeta } from '../core/types';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

export abstract class BasePostgresRepository<T extends Prisma.ModelName> implements BaseRepository {
  private readonly MAX_DEFAULT_LIMIT = 50;
  private readonly INIT_PAGE = 1;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: Prisma.TypeMap['meta']['modelProps'],
    protected readonly searchFields?: (keyof Prisma.TypeMap['model'][T]['fields'])[],
    protected readonly excludedField?: (keyof Prisma.TypeMap['model'][T]['fields'])[],
  ) {}

  public selectedField() {
    const fields = Object.keys(this.prisma[this.model].fields).reduce(
      (acc, key) => {
        if (!this.excludedField.includes(key as keyof Prisma.TypeMap['model'][T]['fields'])) {
          acc[key] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>,
    );

    return fields;
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
    search?: string;
    params?: Prisma.TypeMap['model'][T]['operations']['findMany']['args'];
  }): Promise<ReturnTypeMeta<Prisma.TypeMap['model'][T]['operations']['findMany']['result']>> {
    const page = options ? (options.page ? Number(options.page) : this.INIT_PAGE) : 0;
    const take = options ? (options.limit ? Number(options.limit) : this.MAX_DEFAULT_LIMIT) : 0;

    const skip = page > 0 ? take * (page - 1) : 0;

    const noSearchFn = async () => {
      const [total, data] = await this.prisma.$transaction([
        (this.prisma[this.model] as any).count(options && { where: options.params?.where }),
        (this.prisma[this.model] as any).findMany(options && { ...options.params, take, skip }),
      ]);

      return {
        total,
        data,
      };
    };

    const serachFn = async () => {
      const whereConditions = this.searchFields.reduce(
        (acc, column) => {
          acc.OR.push({
            [column]: {
              contains: options.search,
              mode: 'insensitive',
            },
          });
          return acc;
        },
        {
          ...options.params?.where,
          OR: [],
        } as Record<string, any>,
      );

      const [total, data] = await this.prisma.$transaction([
        (this.prisma[this.model] as any).count({
          where: whereConditions,
        }),
        (this.prisma[this.model] as any).findMany({
          ...options.params,
          where: whereConditions,
          take,
          skip,
        }),
      ]);

      return {
        total,
        data,
      };
    };

    try {
      const { total, data } = options?.search ? await serachFn() : await noSearchFn();

      const lastPage = Math.ceil(total / take);
      const prev = page > 1 ? page - 1 : null;
      const next = page < lastPage ? page + 1 : null;

      return {
        data: data,
        meta: {
          total,
          currentPage: page,
          lastPage,
          perPage: take,
          prev,
          next,
        },
      };
    } catch (error) {
      throw new HttpException(`Ошибка при выполнении запроса: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async findUnique(
    options: Prisma.TypeMap['model'][T]['operations']['findUnique']['args'],
  ): Promise<Prisma.TypeMap['model'][T]['operations']['findUnique']['result']> {
    return await (this.prisma[this.model] as any).findUnique(options);
  }

  async findFirst(
    options: Prisma.TypeMap['model'][T]['operations']['findFirst']['args'],
  ): Promise<Prisma.TypeMap['model'][T]['operations']['findFirst']['result']> {
    return await (this.prisma[this.model] as any).findFirst(options);
  }

  async findById(id: Prisma.TypeMap['model'][T]['payload']['scalars']['id']) {
    return await (this.prisma[this.model] as any).findUnique({
      where: {
        id,
      },
    });
  }

  async create(
    data: Prisma.TypeMap['model'][T]['operations']['create']['args']['data'],
  ): Promise<Prisma.TypeMap['model'][T]['operations']['create']['result']> {
    return await (this.prisma[this.model] as any).create({ data });
  }

  async createMany(
    data: Prisma.TypeMap['model'][T]['operations']['createManyAndReturn']['args']['data'],
  ): Promise<Prisma.TypeMap['model'][T]['operations']['createManyAndReturn']['result']> {
    return await (this.prisma[this.model] as any).createManyAndReturn({ data });
  }

  async update(data: Prisma.TypeMap['model'][T]['operations']['update']['args']['data']) {
    return await (this.prisma[this.model] as any).update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async updateMany(data: Prisma.TypeMap['model'][T]['operations']['updateMany']['args']) {
    return await (this.prisma[this.model] as any).updateMany(data);
  }

  async delete(idList: Prisma.TypeMap['model'][T]['payload']['scalars']['id'][]) {
    await (this.prisma[this.model] as any).deleteMany({
      where: {
        id: {
          in: idList,
        },
      },
    });

    return { status: 'OK' };
  }

  async transaction(action: any[]) {
    return await this.prisma.$transaction(action);
  }

  async transactionStep(fn: (tx: Omit<PrismaClient, ITXClientDenyList>) => Promise<any>) {
    return await this.prisma.$transaction(fn);
  }

  async aggregate(data: Prisma.TypeMap['model'][T]['operations']['aggregate']['args']) {
    return await (this.prisma[this.model] as any).aggregate(data);
  }
}
