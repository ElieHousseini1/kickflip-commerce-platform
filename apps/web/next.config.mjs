const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
);

const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: ["127.0.0.1", "localhost"].includes(
      apiUrl.hostname,
    ),
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", ""),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: `${apiUrl.pathname.replace(/\/$/, "")}/assets/**`,
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
