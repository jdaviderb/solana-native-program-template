import {describe, expect, test} from '@jest/globals';
import { Connection, Transaction, TransactionInstruction, PublicKey, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', async () => {
    const wallet = Keypair.generate();
    const port = process.env['RPC_PORT'];
    const programId = new PublicKey(process.env['SOLANA_PROGRAM_ID'] as string);
    const connection = new Connection(`http://localhost:${port}`, 'confirmed');
    await connection.requestAirdrop(wallet.publicKey, 5000000000);
    await wait(500);

    
    const InitInstruction = new TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true }
      ],
      programId: new PublicKey(programId),
      data: Buffer.from([0]),
    })

    const transaction = new Transaction().add(InitInstruction);
    transaction.feePayer = wallet.publicKey;

    await sendAndConfirmTransaction(connection, transaction, [wallet]);

    expect(2 + 1).toBe(3);
  });
});


function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}
