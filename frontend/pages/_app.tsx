import Head from "next/head";
import Pusher from 'pusher-js';
import { getCookie } from "cookies-next";
import React, { createContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "../styles/globals.css";

import type { AppProps } from "next/app";

const pusher = new Pusher(process.env.PUSHER_APP_KEY as string, {
    cluster: process.env.PUSHER_APP_CLUSTER as string,
    channelAuthorization: {
        transport: 'ajax',
        endpoint: `${process.env.BACKEND_BASE_URL}/api/pusher/auth`,
        headersProvider() {
            return {
                Authorization: `Bearer ${getCookie("access_token")}`,
            };
        },
    },
    userAuthentication: {
        transport: 'ajax',
        endpoint: `${process.env.BACKEND_BASE_URL}/api/pusher/auth-user`,
        headersProvider() {
            return {
                Authorization: `Bearer ${getCookie("access_token")}`,
            };
        },
    },
});

Pusher.logToConsole = true; // Enable pusher logging - don't include this in production
pusher.connection.bind("connected", () => {
    console.log("::> WebSocket connected Successfully");
});
pusher.connection.bind("disconnected", () => {
    console.log("::> WebSocket connection Disconnected");
});

export const PusherContext = createContext<Pusher>(pusher);

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));

    return (
        <>
            <Head>
                <title>Messaging App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer newestOnTop={true} pauseOnHover={false} autoClose={3000} />

            <QueryClientProvider client={queryClient}>
                <PusherContext.Provider value={pusher}>
                    <div className="font-Poppins h-screen">
                        <Component {...pageProps} />
                    </div>
                </PusherContext.Provider>

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
