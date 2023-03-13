import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital@0;1&family=Oxygen:wght@400;700&display=swap"
        />
      </Head>

      <body className="min-h-screen scroll-smooth bg-white font-sans text-neutral-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
