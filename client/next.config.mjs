/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/next-js',
      '@chakra-ui/icons',
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'embla-carousel',
    ],
  },
};

export default nextConfig;
