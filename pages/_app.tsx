import NProgress from "@/components/nprogress";
import "@/styles/globals.css";
import "@/styles/syntax.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>React Hooks</title>
        <link rel="canonical" href="react-hooks.vercel.app" />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Reusable React hooks" />
      </Head>

      <NProgress />
      <Component {...pageProps} />
    </Fragment>
  );
}
