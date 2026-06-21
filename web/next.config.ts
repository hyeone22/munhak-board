import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",                 // 정적 export (서버 불필요)
  images: { unoptimized: true },    // export 시 이미지 최적화 비활성
};

export default nextConfig;
