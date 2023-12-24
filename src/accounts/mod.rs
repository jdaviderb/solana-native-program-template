use solana_program::pubkey::Pubkey;

// [derive(Debug)]
pub struct Vault {
  pub owner: Pubkey,
  pub mint: Pubkey,
  pub bump: u8,
  pub used: bool,
}
