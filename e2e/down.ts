interface Process {
  kill(): boolean
}

interface Global {
  SOLANA_VALIDATOR_PROCESS?: Process
}

module.exports = async function() {
  const gb = global as Global;

  if (gb.SOLANA_VALIDATOR_PROCESS) {
    gb.SOLANA_VALIDATOR_PROCESS.kill()
  }
}
