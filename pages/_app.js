import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const getLayout =
        Component.getLayout || ((page) => <Layout>{page}</Layout>);

    return (
        <SessionProvider session={session}>
            {getLayout(
                <>
                    <Component {...pageProps} />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                        }}
                    />
                </>,
            )}
        </SessionProvider>
    );
}

export default MyApp;
