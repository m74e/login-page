// app/page.tsx or app/page.js
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function HomePage() {
  useEffect(() => {
    redirect('/login'); 
  }, []);

  return null;
}
