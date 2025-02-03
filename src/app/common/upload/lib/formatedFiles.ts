import { formatBytes } from '.';
import { ExtendExpressMulterFile, FileTypes, FileData } from './types';

export const formatedFiles = (file: ExtendExpressMulterFile, type: FileTypes, storage: string) => {
  const fileSize = formatBytes(file.size as number);

  const dotIndex = file.originalname.lastIndexOf('.');
  const ext = dotIndex === -1 ? '' : file.originalname.substring(dotIndex + 1);

  const formatedFile: FileData = {
    name: file.filename,
    originalName: file.originalname,
    type,
    url: `${storage}/${file.filename}`,
    extention: ext.toLocaleLowerCase(),
    size: `${Math.round(fileSize.size)} ${fileSize.name}`,
  };

  return formatedFile;
};
