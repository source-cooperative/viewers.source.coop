import { useRouter } from "next/router";
import { Layout } from "@source-cooperative/components";
import { ViewerLoader } from "../../components/viewers/viewer";


export default function FileViewer() {
    const router = useRouter();
    
    return <Layout>
        <ViewerLoader url={router.query.url as string} viewerId={router.query.viewer as string} />
    </Layout>
}