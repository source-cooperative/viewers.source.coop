import { useState, useEffect } from "react"
import { viewers } from "./viewers/viewer";


export default function Viewer ({url, viewerId} : {url: string, viewerId?: string}) {
    const [selectedViewer, setSelectedViewer] = useState(viewerId);
    const [supportedViewers, setSupportedViewers] = useState({});
    const [unsupportedViewers, setUnsupportedViewers] = useState({});

    // Fetch the content-type and content-length of the file and build the list of supported and unsupported viewers
    useEffect(() => {
        fetch(url, {method: 'HEAD'}).then((res) => {
            var metadata = {};
            var supportedViewers = {};
            var unsupportedViewers = {};

            if (res.headers.get("content-type")) {
                metadata["content-type"] = res.headers.get("content-type");
            }
            if (res.headers.get("content-length")) {
                metadata["content-length"] = res.headers.get("content-length");
            }

            metadata["filename"] =  new URL(url).pathname.split('/').reverse()[0];
            const extensions = metadata["filename"].split(".").reverse().slice(0,-1).map((ext, i) => {
                let exts = metadata["filename"].split(".").reverse().slice(0,-1);
                return exts.slice(0, i+1).reverse().join(".");
            });

            
            for (const [viewerId, viewerMetadata] of Object.entries(viewers)) {
                var supported = true;
                if (viewerMetadata.maxSizeBytes && metadata["content-length"] > viewerMetadata.maxSizeBytes) {
                    supported = false;
                }

                if (viewerMetadata.contentTypes && !viewerMetadata.contentTypes.includes(metadata["content-type"])) {
                    supported = false;
                }

                if (viewerMetadata.extensions) {
                    supported = false;
                    for (const ext of extensions) {
                        if (viewerMetadata.extensions.includes(ext)) {
                            supported = true;
                        }
                    }
                }

                if (supported) {
                    supportedViewers[viewerId] = viewerMetadata;
                } else {
                    unsupportedViewers[viewerId] = viewerMetadata;
                }
            }

            setSupportedViewers(supportedViewers);
            setUnsupportedViewers(unsupportedViewers);
        });
    }, [url])

    if (selectedViewer && supportedViewers[selectedViewer]) {
        return (
            <>
                <button onClick={(e) => {setSelectedViewer(null)}}>Back</button>
                {supportedViewers[selectedViewer].viewer()}
            </>
        )
    }

    return <>
        <h3>Supported Viewers</h3>
        {
            Object.keys(supportedViewers).map((viewerId, i) => {
                return <button onClick={(e) => {setSelectedViewer(viewerId)}}>{viewerId}</button>
            })
        } 
        <h3>Unsupported Viewers</h3>
        {
            Object.keys(unsupportedViewers).map((viewerId, i) => {
                return <p>{viewerId}</p>
            })
        }
    </>
}