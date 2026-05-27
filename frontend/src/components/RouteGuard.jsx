'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FullPageLoader } from '@/components/ui/LoadingState';

export default function RouteGuard({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
    }
  }, [user, loading, requiredRole, router]);

  if (loading || !user) return <FullPageLoader />;
  if (requiredRole && user.role !== requiredRole) return <FullPageLoader />;

  return children;
}
