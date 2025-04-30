/* eslint-disable @typescript-eslint/no-explicit-any */
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Tipagem para arquivos recebidos
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Express.Request, file: Express.Multer.File, cb) {
    cb(null, path.join(process.cwd(), 'public', 'uploads'));
  },
  filename: function (req: Express.Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });

// Helper para usar multer com Next.js API Route
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (...args: any[]) => void,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
