/** @type {import('next').NextConfig} */
const { version } = require("./package.json");
const nextConfig = {
	reactStrictMode: true,
	trailingSlash: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
				port: "",
				pathname: "/**",
			},
		],
	},
	publicRuntimeConfig: {
		version,
	},
	transpilePackages: ["@source-cooperative/components"],
};

module.exports = nextConfig;
