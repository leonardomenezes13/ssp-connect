import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'SSP Connect',
  description: 'Sistema interno de chamados',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`h-full ${inter.variable}`}>
      <body className="min-h-full">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
