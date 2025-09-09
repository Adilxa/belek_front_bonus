import type { Metadata } from 'next';
import './globals.css';
import Provider from '@/components/providers';

export const metadata: Metadata = {
  title: 'Бонусная система - БЕЛЕК ТЕХНИКА',
  description: 'Система лояльности для клиентов БТ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}