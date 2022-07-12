import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { NotificationProvider } from "web3uikit";

function MyApp({ Component, pageProps }: AppProps) {
  console.log(process.env.NEXT_PUBLIC_MORALIS_URL);
  console.log(process.env.NEXT_PUBLIC_APP_ID);
  return (
    <NotificationProvider >
    <MoralisProvider
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL!}
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID!}
    >
      <Header />
      <Component {...pageProps} />
    </MoralisProvider>
</NotificationProvider>
  );
}

export default MyApp;
