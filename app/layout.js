import "./globals.css";

export const metadata = {
  title: '세종대왕 챗봇',
  description: '세종대왕님과 대화하며 한글을 배워보세요.',
};

import Footer from '@/components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
