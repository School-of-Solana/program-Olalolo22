import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Solana Imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles for the wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

const Root = () => {
  // 1. Set the network to 'devnet' for testing (change to 'mainnet-beta' for real money later)
  const network = WalletAdapterNetwork.Devnet;

  // 2. Get the API endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // 3. Initialize the wallets you want to support
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);