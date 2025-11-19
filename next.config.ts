import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许开发环境下的跨域请求（使用通配符允许所有来源）
  allowedDevOrigins: ["*", "192.168.31.45"],
  images: {
    // 允许 SVG 图片
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      {
        protocol: "https",
        hostname: "**.google.com",
        pathname: "/s2/favicons/**",
      },
      // 允许所有域名的 favicon
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
