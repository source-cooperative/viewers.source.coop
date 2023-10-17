import Viewer from "../components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function ViewerLoader() {
  const router = useRouter();
  const [viewerId, setViewerId] = useState(null);
  const [ready, setReady] = useState(false);
  var url = "https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop/vida/google-microsoft-open-buildings/pmtiles/go_ms_building_footprints.pmtiles";

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.query.viewer) {
      setViewerId(router.query.viewer as string);
    }

    setReady(true);
  }, [router.isReady])

  if (!ready) {
    return <></>
  }

  return <Viewer url={url} viewerId={viewerId} />
}

export default function Home() {
  return <>
    <main>
      <ViewerLoader /> 
    </main>
  </>
}
