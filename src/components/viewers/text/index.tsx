import { FileProps, ViewerMetadata } from "../interfaces"
import { useEffect, useState } from "react";
import { Box, Paragraph } from "theme-ui";
import { CodeBlock } from "@source-cooperative/components";
import Skeleton from 'react-loading-skeleton';

export const viewerMetadata: ViewerMetadata = {
    title: "Text Viewer",
    description: "A text viewer.",
    compatibilityCheck: (props: FileProps) => {
        if (props.filename.toLowerCase().endsWith(".md")) {
            return true;
        }
        
        if (props.filename.toLowerCase().endsWith(".txt")) {
            return true;
        }
        return false;
    },
    viewer: TextViewer
} 

export function TextViewer(props: FileProps) {
    const { url, filename, contentType, size } = props;
    
    const [content, setContent] = useState(null);
    
    useEffect(() => {
        fetch(url).then((response) => {
            if (!response.ok) {
                setContent(`Error: ${response.status} ${response.statusText}`);
                return;
            }
            
            response.text().then((text) => {
                setContent(text);
            });
        });
    }, [url])
    

    if (!content) {
        return <CodeBlock copyButton={false}><Skeleton count={10} /></CodeBlock>
    }
    
    return <Box>
        <CodeBlock copyButton={true}>
            {
                content.split("\n").map((line, i) => {
                    return <Paragraph key={`line-${i}`} sx={{fontFamily: "mono", fontSize: 0}}>{line}</Paragraph>
                })
            }
        </CodeBlock>
    </Box>
}