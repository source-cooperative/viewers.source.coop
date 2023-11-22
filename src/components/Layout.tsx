import { Layout as BaseLayout, Footer, Logo } from "@source-cooperative/components";
import { Flex, Text, Link } from "theme-ui";

const FOOTER_LINKS = [
    {
        href: "/",
        text: "Home"
    },
    {
        href: "about",
        text: "About"
    },
    {
        href: "https://github.com/source-cooperative/viewers/",
        text: "GitHub"
    }
];

const LOGO = <>
    <Link href="/" sx={{textDecoration: "none"}}>
        <Flex sx={{
            justifyContent: "center",
            alignContent: "center"
        }}>
            <Logo sx={{
                height: ["45px", "45px", "55px", "55px"],
                fill: "background",
                backgroundColor: "primary",
                p: 2,
                "&:hover": {
                    fill: "highlight"
                }
            }}/>
            <Text sx={{
                alignSelf: "center",
                ml: 2,
                textDecoration: "none",
                fontSize: 4,
                color: "text",
                fontFamily: "mono",
                fontWeight: "bold",
                alignContent: "center",
                textTransform: "uppercase"
                }}>
                {"<Viewers>"}
            </Text>
        </Flex>
    </Link>
</>

export default function Layout(props) {
    return <>
        <BaseLayout logo={LOGO} footer={<Footer links={FOOTER_LINKS} />}>
            {props.children}
        </BaseLayout>
    </>
}