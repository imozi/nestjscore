export const formatBytes = (bytes: number, decimals = 2) => {
  if (typeof bytes !== 'number' || bytes < 0) {
    throw new Error('Invalid bytes parameter');
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const map = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return {
    size,
    name: map[i],
  };
};
