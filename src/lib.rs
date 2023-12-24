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



pub enum VaultProgramInstruction {
    Init,
    Update { amount: u8 },
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = cast_to(&instruction_data);

    match instruction {
        VaultProgramInstruction::Init => {
            let account =  accounts.get(0).unwrap();
            let signer =  accounts.get(1).unwrap();
            let mint: &AccountInfo<'_> =  accounts.get(1).unwrap();
            let mut account_data = &mut account.data.borrow_mut();
            let mut vault: &mut Vault = cast_mut_to(&mut account_data);

            let (pda, _bump_seed) = Pubkey::find_program_address(
                &[b"vault"], 
                program_id)
            ;

            // if account.key != &pda {
            //     return Err(ProgramError::UninitializedAccount);
            // }

            vault.owner = *signer.key;
            vault.mint = *mint.key;
            vault.used = true;
        },

        VaultProgramInstruction::Update { amount } => {
            msg!("Instruction: Update");
            msg!("Amount: {}", amount);

            if amount <= &100 {
                return Err(ProgramError::UninitializedAccount);
            }

        },
    }
    
    Ok(())
}


#[cfg(test)]
mod test {
    use super::*;
    use crate::utils::cast_to_parts;
    use solana_program::{clock::Epoch, lamports};
    use std::mem;

    #[test]
    fn test_sanity() {
        let program_id = Pubkey::default();
        let key = Pubkey::new_unique();
        let mut lamports = 0;
        let mut lamports2: u64 = 0;
        let mut data = vec![0; mem::size_of::<Vault>()];
        let mut data2 = vec![0; mem::size_of::<Vault>()];
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let owner = AccountInfo::new(
            &key,
            false,  
            true,
            &mut lamports2,
            &mut data2,
            &owner,
            false,
            Epoch::default(),
        );

        let accounts = vec![account, owner];
        let instruction_data = cast_to_parts(&VaultProgramInstruction::Init);
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();

        let account = accounts.get(0).unwrap();
        let account_data = &account.data.borrow_mut();
        let vault: &Vault = cast_to(&account_data);
        assert_eq!(vault.used, true);
        assert_eq!(vault.owner, *accounts[1].key);
      
    }
}
