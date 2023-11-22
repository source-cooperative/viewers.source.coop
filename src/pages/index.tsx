import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Form, FieldState, FieldType, FormResult, Logo, Footer } from "@source-cooperative/components";
import { Box, Text, Flex, Heading, Link } from "theme-ui";
import { ViewerLoader } from "../components/viewers/viewer";
import Layout from "../components/Layout";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState(null);
  const [selectedViewer, setSelectedViewer] = useState(null);
  
  const [urlState, setUrlState] = useState({
    state: FieldState.INVALID,
    message: null,
  })
  
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    
    if (router.query.url) {
      setUrl(router.query.url as string);
    } else {
      setUrl(null);
    }
    
    if (router.query.viewer) {
      setSelectedViewer(router.query.viewer as string);
    } else {
      setSelectedViewer(null);
    }
  }, [router.query])

  var fields = [
    {
      id: "url",
      required: true,
      type: FieldType.TEXT,
      title: "File URL",
      state: urlState,
      validationDelay: 1,
      setState: (state: {state: FieldState, message?: string}) => {
        setUrlState({
          state: state.state,
          message: state.message
        })
      },
      onValidation: (val: string) => {
        setUrlState({
          state: FieldState.VALID,
          message: null
        })
      }
    }
  ];
  
  function onSubmit(values: { [key: string]: string }): Promise<FormResult> {
    return new Promise((resolve, reject) => {
      router.push(`/?url=${values.url}`)
    })
  }
  
  const logo = <Link href="/">
    <Flex sx={{justifyContent: "center", alignContent: "center"}}>
    
    
      <Logo
        sx={{
          height: ["45px", "45px", "55px", "55px"],
          fill: "background",
          backgroundColor: "primary",
          p: 2,
          "&:hover": {
            fill: "highlight"
          }
        }}
      />
      <Text sx={{ alignSelf: "center", ml: 2, textDecoration: "none", fontSize: 4, color: "text", fontFamily: "mono", fontWeight: "bold", alignContent: "center" }}>Viewers</Text>
    </Flex>
  </Link>;
  
  return <Layout>
    
    {
      url ? <ViewerLoader url={url} viewerId={selectedViewer} /> : <Box sx={{maxWidth: "800em"}}><Heading as="h2">Enter a URL</Heading>
        <Form onSubmit={onSubmit} gridColumns={["auto", "auto", "1fr 1fr", "1fr 1fr"]} fields={fields} />
      </Box>
    }  
  </Layout>
}
