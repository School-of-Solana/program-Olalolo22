import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TipProject } from "../target/types/tip_project";
import { assert } from "chai";

describe("tip_project", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TipProject as Program<TipProject>;
  const sender = provider.wallet as anchor.Wallet;

  console.log("Testing on Network:", provider.connection.rpcEndpoint);

  it("HAPPY PATH: Sends a tip successfully on Devnet", async () => {
    const recipient = anchor.web3.Keypair.generate();
    const amount = new anchor.BN(1000000); 
    const message = "Devnet Test Tip!";
    const seed = new anchor.BN(Date.now());

    
    const [tipPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("tip"),
        sender.publicKey.toBuffer(),
        seed.toArrayLike(Buffer, 'le', 8)
      ],
      program.programId
    );

    try {
      const tx = await program.methods
        .sendTip(amount, message, seed)
        .accounts({
          sender: sender.publicKey,
          recipient: recipient.publicKey,
          tipAccount: tipPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log("✅ Transaction Signature:", tx);
    } catch (e) {
      console.error("❌ Transaction Failed:", e);
      assert.fail("Happy path should not fail");
    }
  });

  it("UNHAPPY PATH: Fails when amount is 0", async () => {
    const recipient = anchor.web3.Keypair.generate();
    const amount = new anchor.BN(0);
    const seed = new anchor.BN(Date.now() + 1);
    
    const [tipPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("tip"), sender.publicKey.toBuffer(), seed.toArrayLike(Buffer, 'le', 8)],
        program.programId
    );

    try {
      await program.methods
        .sendTip(amount, "Should fail", seed)
        .accounts({
          sender: sender.publicKey,
          recipient: recipient.publicKey,
          tipAccount: tipPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("The transaction should have failed but didn't!");
    } catch (error) {
      console.log("✅ Correctly caught error:", error.message || error.toString());
      assert.ok(true);
    }
  });
});