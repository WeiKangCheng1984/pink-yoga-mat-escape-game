import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '粉紅瑜珈墊 - 密室逃脫',
  description: '你越強壯，越接近被收割。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-dark-bg text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}

