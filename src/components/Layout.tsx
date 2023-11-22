import { BaseLayout, Footer, Logo } from "@source-cooperative/components";
import { Flex, Text, Link } from "theme-ui";
import getConfig from "next/config";

const FOOTER_LINKS = [
	{
		href: "/",
		text: "Home",
	},
	{
		href: "about",
		text: "About",
	},
	{
		href: "https://github.com/source-cooperative/viewers/",
		text: "GitHub Repository",
	},
	{
		href: "https://github.com/source-cooperative/viewers/issues/",
		text: "Support",
	},
	{
		href: "https://beta.source.coop",
		text: "Source Cooperative",
	},
	{
		href: "https://radiant.earth",
		text: "Radiant Earth",
	},
];

const { publicRuntimeConfig } = getConfig();
const version = publicRuntimeConfig?.version;

const LOGO = (
	<>
		<Link href="/" sx={{ textDecoration: "none" }}>
			<Flex
				sx={{
					justifyContent: "start",
				}}
			>
				<Logo
					sx={{
						height: ["45px", "45px", "55px", "55px"],
						fill: "background",
						backgroundColor: "primary",
						p: 2,
						"&:hover": {
							fill: "highlight",
						},
					}}
				/>
				<Text
					sx={{
						ml: 2,
						textDecoration: "none",
						fontSize: 4,
						color: "text",
						fontFamily: "mono",
						fontWeight: "bold",
						textTransform: "uppercase",
						alignSelf: "center",
					}}
				>
					{"Viewers"}
				</Text>
			</Flex>
		</Link>
	</>
);

export default function Layout(props) {
	return (
		<>
			<BaseLayout
				logo={LOGO}
				footer={<Footer links={FOOTER_LINKS} text={[`v${version}`]} />}
			>
				{props.children}
			</BaseLayout>
		</>
	);
}
