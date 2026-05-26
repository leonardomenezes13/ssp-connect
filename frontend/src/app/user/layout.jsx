import RouteGuard from '@/components/RouteGuard';

export default function UserLayout({ children }) {
  return <RouteGuard requiredRole="USER">{children}</RouteGuard>;
}
