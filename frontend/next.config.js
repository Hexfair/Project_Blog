// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	reactStrictMode: true,
// };

// module.exports = nextConfig;

module.exports = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'mirpozitiva.ru',
				pathname: '**/**',
			},
			{
				protocol: 'https',
				hostname: 'localhost',
				port: '4444',
				pathname: '**/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '4444',
				pathname: '**/**',
			},
		],
	},
	distDir: 'build',
};