import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '후추(Huchu) - AI 기반 통합 비즈니스 플랫폼',
  description: '경영지원팀이 없는 중소기업을 위한 올인원 SaaS 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
