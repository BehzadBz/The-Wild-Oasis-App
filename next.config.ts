import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "htehxowmmddgovqvofmk.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
