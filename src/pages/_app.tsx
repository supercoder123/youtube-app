import "../styles/globals.css";
import type { AppProps } from "next/app";
import toast, { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
