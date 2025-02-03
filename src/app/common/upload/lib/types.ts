export enum FileTypes {
  IMAGE = 'images',
  DOCS = 'docs',
  VIDEO = 'video',
}

export interface ExtendExpressMulterFile extends Omit<Express.Multer.File, 'size'> {
  size: number | { size: number; name: string };
}

export type FileData = {
  name: string;
  originalName: string;
  type: FileTypes;
  url: string;
  extention: string;
  size: string;
};
