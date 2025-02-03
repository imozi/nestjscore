import { access, constants } from 'fs/promises';

export const isExistFile = async (path: string) => {
  try {
    await access(path, constants.F_OK);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};
