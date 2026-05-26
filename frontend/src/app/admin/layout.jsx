import RouteGuard from '@/components/RouteGuard';

export default function AdminLayout({ children }) {
  return <RouteGuard requiredRole="ADMIN">{children}</RouteGuard>;
}
