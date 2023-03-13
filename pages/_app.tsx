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
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <NProgress />
      <Component {...pageProps} />
    </Fragment>
  );
}
