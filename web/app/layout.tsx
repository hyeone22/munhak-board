import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "문학 공모전 모아보기",
  description:
    "시·소설·수필·백일장 등 흩어진 문학 공모전 공고를 한곳에 모아 마감 임박순으로 보는 대시보드.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        {/* Pretendard (전체 폰트) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
