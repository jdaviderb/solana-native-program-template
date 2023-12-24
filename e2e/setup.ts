import { spawn } from 'child_process';
import fs from 'fs';
import PackageConfig from './package.json';

import { Keypair } from '@solana/web3.js';

process.env['RPC_PORT'] = process.env['RPC_PORT'] || '8899';
const RPC_PORT = process.env['RPC_PORT'];

module.exports = function() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(PackageConfig.solana.wallet)) {
      reject(`wallet path: ${PackageConfig.solana.wallet} not found`);
    }

    if (!fs.existsSync(PackageConfig.solana.output)) {
      reject(`solana program path: ${PackageConfig.solana.output} not found`);
    }

    const programRawKeypair = JSON.parse(fs.readFileSync(PackageConfig.solana.wallet, 'utf-8'));
    const programLibPath = PackageConfig.solana.output;
    const programKeyPair = Keypair.fromSecretKey(Buffer.from(programRawKeypair));
    process.env['SOLANA_PROGRAM_ID'] = programKeyPair.publicKey.toString();
    const gb = global as any;

    gb.SOLANA_VALIDATOR_PROCESS = spawn('solana-test-validator', ['--bpf-program', programKeyPair.publicKey.toString(), programLibPath, '--reset', '--rpc-port', RPC_PORT.toString(), '-l', './validator']);
    gb.SOLANA_VALIDATOR_PROCESS.on('close', () => reject('solana-test-validator failed to start'));
    
    waitForRpc().then(() => {
      resolve(true);

      spawn('solana', ["logs"])
      .stdout.on('data', (data: Buffer) => {
        if (!fs.existsSync('./program.log')) {
          fs.writeFileSync('./program.log', '');
        }

        fs.appendFileSync('./program.log', data.toString());
      });
    })
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
  const data = await fetch(`http://localhost:${RPC_PORT}`, {
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
