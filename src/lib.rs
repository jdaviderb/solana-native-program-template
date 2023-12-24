use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut accounts_iter = accounts.iter();
    let _signer = next_account_info(&mut accounts_iter)?;
    let counter = next_account_info(&mut accounts_iter)?;

    match instruction_data[0] {
        0 => {
            msg!("Initialize Account");
            counter.data.borrow_mut()[0] = 1;
        }

        1 => {
            msg!("Increase Account");
            counter.data.borrow_mut()[0] += 1;
        } 

        _ => {
            return Err(solana_program::program_error::ProgramError::InvalidInstructionData);
        }
    }

    Ok(())
}
