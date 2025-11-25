import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const CustomWalletButton = () => {
  return (
    <div className="relative group">
      {/* We wrap the button in a div to style it via CSS in index.css, 
          but we also add a glow effect behind it */}
      <div className="absolute -inset-0.5 bg-primary opacity-20 group-hover:opacity-50 rounded-xl blur transition duration-200"></div>
      <div className="relative custom-wallet-wrapper">
        <WalletMultiButton />
      </div>
    </div>
  );
};