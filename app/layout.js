import "./globals.css";
import { Gowun_Dodum, Jua } from 'next/font/google';

const gowunDodum = Gowun_Dodum({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gowun-dodum',
});

const jua = Jua({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jua',
});

export const metadata = {
  title: '세종대왕 챗봇',
  description: '세종대왕님과 대화하며 한글을 배워보세요.',
};

import Footer from '@/components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${gowunDodum.variable} ${jua.variable}`}>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
