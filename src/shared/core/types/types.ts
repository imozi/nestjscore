export type ReturnTypeMeta<T> = {
  data: T;
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
    prev: number;
    next: number;
  };
};

export type DeviceInfo = {
  ip: string | string[];
  ua: string;
  description: {
    browser: {
      name: string;
      version: string;
    };
    os: {
      name: string;
      version: string;
    };
    device: {
      vendor: string;
      model: string;
      type: string;
    };
  };
};

export type PaginateQuery = {
  id?: string;
  page: number;
  limit: number;
  search: string;
};
