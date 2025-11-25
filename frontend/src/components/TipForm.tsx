import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export const TipForm = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTip = async () => {
    if (!publicKey) {
      setStatus('Please connect your wallet first! 🔌');
      return;
    }
    if (!recipient || !amount) {
      setStatus('Please fill in all fields! 📝');
      return;
    }

    try {
      setLoading(true);
      setStatus('Initiating transaction... 🔄');

      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // Used a NativeSystemProgram
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        })
      );

      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      setStatus('Please approve in wallet... 🔐');

      
      const signature = await sendTransaction(transaction, connection);
      
      setStatus('Confirming on blockchain... 🧱');
      await connection.confirmTransaction(signature, 'confirmed');

      setStatus('Tip sent successfully! 🎉');
      console.log("Tx Signature:", signature);
      
      setAmount('');
      setMessage('');
      
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("User rejected")) {
        setStatus('Transaction rejected by user ❌');
      } else {
        setStatus('Failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 ml-1">Recipient Address</label>
        <input
          type="text"
          placeholder="Enter Solana Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 ml-1">Amount (SOL)</label>
        <div className="relative">
          <input
            type="number"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all pr-16"
          />
          <div className="absolute right-4 top-3 text-zinc-500 font-medium text-sm pointer-events-none">
            SOL
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 ml-1">Message</label>
        <textarea
          placeholder="Say thanks..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all h-24 resize-none"
        />
      </div>

      {status && (
        <div className={`p-3 rounded-lg text-sm text-center font-medium ${
          status.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          status.includes('Failed') || status.includes('rejected') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          'bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse'
        }`}>
          {status}
        </div>
      )}

      <button
        onClick={handleTip}
        disabled={!publicKey || loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform active:scale-95"
      >
        {loading ? 'Processing...' : publicKey ? 'Send Tip 💸' : 'Connect Wallet First'}
      </button>
    </div>
  );
};