
const fetcher = async opts => {
  const { path, args, exclude_credentials, external, raw, markdown } = opts;

  var url = new URL(external ? path : process.env.NEXT_PUBLIC_API_BASE + path);

  if (args) {
    var params = [];

    Object.keys(args).forEach(function(key) {
      if (args[key]) {
        params.push([key, args[key]]);
      }
    });

    url.search = new URLSearchParams(params).toString();
  }

  var options = {}
  if (!exclude_credentials) {
    options = {credentials: "include"}
  }
  
  const res = await fetch(url, options)
 
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.

    // @ts-ignore
    error.info = await res.json()
    // @ts-ignore
    error.status = res.status
    throw error
  }
}



import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
        <Component {...pageProps} />
    </main>
  );
}
