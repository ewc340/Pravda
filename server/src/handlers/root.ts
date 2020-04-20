import { Request, Response } from 'express';

export const root = (_req: Request, res: Response) => {
  return res.send('API is working!');
};