import { spawn } from 'child_process';
import fs from 'fs';
import PackageConfig from './package.json';

import { Keypair } from '@solana/web3.js';

process.env['RPC_PORT'] = process.env['RPC_PORT'] || '8899';
const RPC_PORT = process.env['RPC_PORT'];

module.exports = async function() {
  if (!fs.existsSync(PackageConfig.solana.wallet)) {
    throw new Error(`wallet path: ${PackageConfig.solana.wallet} not found`);
  }

  if (!fs.existsSync(PackageConfig.solana.output)) {
    throw new Error(`program path: ${PackageConfig.solana.output} not found`);
  }

  // Get Program Keypair
  const programRawKeypair = JSON.parse(fs.readFileSync(PackageConfig.solana.wallet, 'utf-8'));
  const programLibPath = PackageConfig.solana.output;
  const programKeyPair = Keypair.fromSecretKey(Buffer.from(programRawKeypair));

  // Set SOLANA_PROGRAM_ID denvironment
  process.env['SOLANA_PROGRAM_ID'] = programKeyPair.publicKey.toString();
  const gb = global as any;

  // Initialize Solana Validator
  gb.SOLANA_VALIDATOR_PROCESS = spawn('solana-test-validator', ['--bpf-program', programKeyPair.publicKey.toString(), programLibPath, '--reset', '--rpc-port', RPC_PORT.toString(), '-l', './validator']);

  // Wait for RPC to be ready
  await waitForRpc();

  // if Solana validator is ready, start logging
  spawn('solana', ["logs"])
  .stdout.on('data', (data: Buffer) => {
    if (!fs.existsSync('./program.log')) {
      fs.writeFileSync('./program.log', '');
    }
    
    fs.appendFileSync('./program.log', data.toString());
  });
}

async function waitForRpc(): Promise<boolean> {
  while (true) {
    if (await (validateRpc())) {
      return true;
    }
  }
}

async function validateRpc(): Promise<boolean> {
  const data = await fetch(`http://127.0.0.1:${RPC_PORT}`, {
    method: 'post',
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getHealth"
    }),
    headers: { 'Content-Type': 'application/json' },
  })
  .then((res) => res.json())
  .catch(() => null)

  return data?.result === 'ok';
}
