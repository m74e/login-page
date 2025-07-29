import { Suspense } from 'react';
import PasswordCard from '@/components/card'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading form...</div>}>
      <PasswordCard />
    </Suspense>
  );
}