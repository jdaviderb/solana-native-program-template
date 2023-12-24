mod utils;
mod accounts;

use crate::utils::cast_to;
use crate::utils::cast_mut_to;
use crate::accounts::Vault;

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);



pub enum ProgramInstructions {
    Init,
}

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instructions: &ProgramInstructions = cast_to(&instruction_data);

    match instructions {
        ProgramInstructions::Init => {
            msg!("Jorge Hernandez");
        },
    }

    
    Ok(())
}
