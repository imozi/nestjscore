import * as dayjs from 'dayjs';

export const getExpiryDay = (days: string) => {
  const dayCount = parseInt(days, 10);

  if (isNaN(dayCount)) {
    throw new Error('Invalid duration format');
  }

  return dayjs().add(dayCount, 'days').toDate();
};
