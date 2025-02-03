import { validate as uuidValidate } from 'uuid';

export const validateUuid = (uuid: string): boolean => {
  return uuidValidate(uuid);
};
