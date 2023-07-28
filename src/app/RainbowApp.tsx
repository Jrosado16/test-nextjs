'use client'
import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonZkEvm, polygonZkEvmTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect, useState } from 'react';
import { rainbowWeb3AuthConnector } from '@/config/Web3Auth.config';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygonZkEvmTestnet,
    polygonZkEvm,
  ],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: 'ZK Tropykus App',
  projectId: 'dc798e9ad98c0433fa755ea2727fb491',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      rainbowWeb3AuthConnector({ chains, connectionType: 'google' }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function RainbowApp({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default RainbowApp;
