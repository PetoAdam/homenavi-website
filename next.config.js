/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    // Screenshots are vendored locally under public/screenshots.
    unoptimized: true,
  },
};

export default nextConfig;
