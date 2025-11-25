import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>💫 TipStream</h1>
        <p>Send SOL with personalized messages on-chain</p>
        <div className="wallet-container">
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}