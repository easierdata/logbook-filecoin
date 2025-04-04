"use client";

// import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import React from "react";
import { Header } from "../components/Header";
import { BlockieAvatar } from "../components/scaffold-eth";
import { ProgressBar } from "../components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "../hooks/scaffold-eth";
import { useGlobalState } from "../services/store/store";
import { wagmiConfig } from "../services/web3/wagmiConfig";
import { EASProvider } from "./EasContextProvider";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
// import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <>
      <div className="flex flex-col">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        {/* <Footer /> */}
      </div>
      {/* <Toaster /> */}
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  const client = new ApolloClient({
    uri: "https://sepolia.easscan.org/graphql",
    //            ^^ for custom  queries, we need this to be dynamically set.
    // The string is accessible from the EAS.config.ts file and the useChainId hook.
    // I can't work out how to get the chainId from the wagmiConfig object since this isn't wrapped in the provider, or something ...
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <EASProvider>
            <ApolloProvider client={client}>
              <ScaffoldEthApp>{children}</ScaffoldEthApp>
            </ApolloProvider>
          </EASProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
};
