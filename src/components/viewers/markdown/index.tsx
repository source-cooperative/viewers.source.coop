import { FileProps, ViewerMetadata } from "../interfaces"
import { useEffect, useState } from "react";
import provider from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { SourceComponents } from "@source-cooperative/components";
import Skeleton from 'react-loading-skeleton';
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const viewerMetadata: ViewerMetadata = {
    title: "Markdown Viewer",
    description: "A markdown viewer.",
    compatibilityCheck: (props: FileProps) => {
        if (props.filename.toLowerCase().endsWith(".md")) {
            return true;
        }
        return false;
    },
    viewer: MarkdownViewer
} 

const mdxOptions = {
  rehypePlugins: [rehypeSlug],
  remarkPlugins: [remarkGfm],
};


export function MarkdownViewer(props: FileProps) {
    const { url, filename, contentType, size } = props;
    
    const [content, setContent] = useState(null);
    const [mdxModule, setMdxModule] = useState(null);
    
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
    
    useEffect(() => {
        if (!content) {
            return;
        }
        evaluate(content, {
            ...provider,
            ...runtime,
            useMDXComponents: SourceComponents,
            ...mdxOptions,
        } as any).then((module) => {
            setMdxModule(module);
        });
    }, [content]);

    if (!content || !mdxModule) {
        return <Skeleton count={10} />
    }

    const Content = mdxModule ? mdxModule.default : <></>;
    
    return <Content />
}