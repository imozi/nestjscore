import { transliterate, slugify } from 'transliteration';

export const editFileName = (file: Express.Multer.File) => {
  const originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');

  const translitName = transliterate(originalname);

  const repl = slugify(translitName, {
    separator: '_',
    trim: true,
    lowercase: true,
    replace: { '-': '_' },
  });

  return { originalname, repl };
};
