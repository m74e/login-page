import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
     console.log(req,":req");
    return res.status(405).end('Method Not Allowed');
   
  }

  const { accessToken, refreshToken } = req.body as {
    accessToken?: string;
    refreshToken?: string;
  };

  if (!accessToken || !refreshToken) {
    return res.status(400).json({ message: 'Tokens required' });
  }


  res.setHeader('Set-Cookie', [
    serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    }),
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }),
  ]);

  return res.status(200).json({ message: 'Tokens set' });
}
