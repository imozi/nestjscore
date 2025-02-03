import { ReturnTypeMeta } from '../types';

export interface BaseRepository {
  findMany: (options?: Record<string, any>) => Promise<ReturnTypeMeta<any>>;
  findUnique: (options?: Record<string, any>) => Promise<any>;
  findById: (id: any) => Promise<any>;
  create: (data: any) => Promise<any>;
  delete: (idList: any[]) => Promise<any>;
}
