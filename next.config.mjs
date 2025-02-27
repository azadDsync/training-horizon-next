/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      dangerouslyAllowSVG: true,
      domains: ['domendra-image-bucket.s3.ap-south-1.amazonaws.com','s3-alpha-sig.figma.com', 'thumbs.dreamstime.com','ui-avatars.com'],
      unoptimized: true,
    },
  };
  
  export default nextConfig;