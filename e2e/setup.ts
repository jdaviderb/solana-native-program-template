import { exec, spawn } from 'child_process';
const RPC_PORT = process.env['RPC_PORT'] || 8899;

module.exports = function() {
  return new Promise((resolve, reject) => {
    const gb = global as any;

    gb.SOLANA_VALIDATOR_PROCESS = spawn('solana-test-validator', ['--bpf-program', 'scExovSNTiuapmP43KJmsKVJ3xAU3Gta4mtBkkpbWSW', '../target/sbf-solana-solana/release/solana_program.so', '--reset', '--rpc-port', RPC_PORT.toString(), '-l', './validator']);
    gb.SOLANA_VALIDATOR_PROCESS.on('close', () => reject('solana-test-validator failed to start'));
    waitForRpc().then(resolve)
  });
}

async function waitForRpc() {
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
