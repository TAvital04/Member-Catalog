import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	outputFileTracingRoot: path.join(__dirname, '../../'),
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
				port: '',
				pathname: '/avatars/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
				port: '',
				pathname: '/embed/avatars/**',
			},
			// Vercel Blob public store (preview / production)
			{
				protocol: 'https',
				hostname: '*.public.blob.vercel-storage.com',
				port: '',
				pathname: '/**',
			},
			// Local MinIO public bucket (development)
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '9000',
				pathname: '/**',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/resumes',
				destination: process.env.RESUME_DB_URL || 'http://localhost:3001',
			},
			{
				source: '/resumes/:path*',
				destination: `${process.env.RESUME_DB_URL || 'http://localhost:3001'}/:path*`,
			},
		];
	},
};

export default nextConfig;