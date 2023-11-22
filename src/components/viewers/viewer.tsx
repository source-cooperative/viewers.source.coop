// Import your viewer and add it to the viewers object below with a unique ID

import { viewerMetadata as markdown } from "./markdown";
import { viewerMetadata as text } from "./text";
import { viewerMetadata as map } from "./map";
import { useState, useEffect } from "react";
import { Box, Heading, Text, Grid } from "theme-ui";
import { Button } from "@source-cooperative/components";
import { useRouter } from "next/router";

export const viewers = {
    "markdown": markdown,
    "text": text,
    "map": map
}

interface ViewerLoaderProps {
    url: string,
    viewerId?: string,
}

interface FileProps {
    url: string,
    filename: string,
    contentType?: string,
    size?: number
}

export function ViewerLoader(props: ViewerLoaderProps) {
    const { url, viewerId } = props;
    const [fileProps, setFileProps] = useState<FileProps>(null);
    const [compatibleViewers, setCompatibleViewers] = useState(null);
    const [selectedViewer, setSelectedViewer] = useState(null);
    const router = useRouter();
    
    
    useEffect(() => {
        if (!url) {
            return;   
        }
        const fprops = {
            url: url,
            filename: (url as string).split("/").pop()
        }
        
        setFileProps(fprops);
        
        if (viewerId && viewers[viewerId]) {
            const metadata = viewers[viewerId];
            setSelectedViewer(<metadata.viewer url={fprops.url} filename={fprops.filename} />);
            return
        }
        
        var compatibleViewers = [];
        
        for (const [viewerId, viewerMetadata] of Object.entries(viewers)) {
            if (viewerMetadata.compatibilityCheck(fprops)) {
                compatibleViewers.push({
                    id: viewerId,
                    metadata: viewerMetadata
                });
            }
        }       
        
        setCompatibleViewers(compatibleViewers);
        
    }, [url]);
    
    if (!compatibleViewers && !selectedViewer) {
        return <Box sx={{
            py: 2,
            justifyContent: "center",
            display: "flex"
        }}>
            <Text sx={{
                fontFamily: "mono",
                fontSize: 3
            }}>
                Loading...
            </Text>
        </Box>
    }
    
    if (selectedViewer) {
        return <Box sx={{py: 2}}>
            {selectedViewer}
            {
                !viewerId ? <Box sx={{pt: 2}}><Button onClick={(e) => { setSelectedViewer(null) }}>Change Viewer</Button></Box> : <></>
            }
        </Box>
    }
    
    return <Box sx={{py: 2}}>
        <Heading as="h2">Select a Viewer</Heading>
        <Grid sx={{gridTemplateColumns: "1fr"}}>
        {
            compatibleViewers.map((viewer, i) => {
                const { id, metadata } = viewer;
                
                return <Button key={`viewer-${i}`} onClick={(e) => {
                    router.query.viewer = id;
                    router.push(router);
                    setSelectedViewer(<metadata.viewer url={fileProps.url} filename={fileProps.filename} />);
                }}>{metadata.title}</Button>
            })

        }
        </Grid>
    </Box>
}