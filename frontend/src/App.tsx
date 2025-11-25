import React from 'react';
import { CustomWalletButton } from './components/CustomWalletButton';
import { TipForm } from './components/TipForm';

function App() {
  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <span className="font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-100">
              LaLa01 <span className="text-purple-500">Tipping</span>
            </span>
          </div>
          <CustomWalletButton />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow relative flex items-center">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT COLUMN: Pitch */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Show appreciation <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                on the Blockchain.
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Send SOL directly to creators, friends, or developers instantly. 
              No intermediaries, low fees, and instant settlement.
            </p>

            <div className="pt-4 flex gap-4 justify-center lg:justify-start">
              <div className="px-4 py-2 bg-zinc-900/80 rounded-lg border border-zinc-800 text-sm text-zinc-500">
                🚀 Fast
              </div>
              <div className="px-4 py-2 bg-zinc-900/80 rounded-lg border border-zinc-800 text-sm text-zinc-500">
                🔒 Secure
              </div>
              <div className="px-4 py-2 bg-zinc-900/80 rounded-lg border border-zinc-800 text-sm text-zinc-500">
                💸 Low Fees
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Tipping Card */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-40"></div>
            <div className="relative bg-surface border border-border rounded-2xl p-8 shadow-2xl">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Send a Tip</h3>
                <p className="text-zinc-500 text-sm">Transfer SOL securely</p>
              </div>

              {/* THE FUNCTIONAL FORM */}
              <TipForm />

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;