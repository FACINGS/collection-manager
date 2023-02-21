import { Html, Head, Main, NextScript } from 'next/document';
import {
  favicon,
  appName,
  appDescription,
  metaIcon,
  appUrl,
} from '@configs/globalsConfig';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content={appDescription} />
        <meta property="og:title" content={appName} />
        <meta property="og:site_name" content={appName} />
        <meta property="og:description" content={appDescription} />
        <meta property="og:image" content={metaIcon} />
        <meta property="og:url" content={appUrl} />
        <meta name="twitter:image:alt" content={appDescription} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={metaIcon} />
        <link rel="icon" href={favicon} />
        <link rel="apple-touch-icon" href={metaIcon} />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
