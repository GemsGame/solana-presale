use borsh::{BorshDeserialize, BorshSerialize};

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
};

// Define the type of state stored in accounts


#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct CampaignDetails {

    // 0 [signer] the account of the person initializated the escrow
    // 1 [writable] the temporary token account than should be created prior to this instuctions and owned initializer
    // 2 [] the initializer token account
    // 3 [writable]  the escrow account hold info about campaign
    // 4 [] the rent syswar
    // 5 [] the token program
    pub signer: Pubkey,
    pub temp_account: Pubkey,
    pub token_account: Pubkey,
    pub escrow_account: Pubkey,
    //pub is_initialized: bool,
    pub amount: u64,
}
// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    if instruction_data.len() == 0 {
        return Err(ProgramError::InvalidInstructionData);
    };

    if instruction_data[0] == 0 {
        return create_campaign(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    }
    if instruction_data[0] == 1 {
        return donate(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    }
    if instruction_data[0] == 2 {
        return create_campaign2(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    }
    Ok(())
}

fn donate(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let writing_account = next_account_info(accounts_iter)?; //pubId ico <- owner of token address
    let donator_program_account = next_account_info(accounts_iter)?; //donator account
    let donator = next_account_info(accounts_iter)?; //donator Wallet signer
    let donator_associated_token_account = next_account_info(accounts_iter)?; //donator associated token account
    let token_program_id_account = next_account_info(accounts_iter)?; //TOKEN ID
    let writting_account_associated_account = next_account_info(accounts_iter)?;
    let campaign_data_account = next_account_info(accounts_iter)?;

    if writing_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }
    if donator_program_account.owner != program_id {
        msg!("donator_program_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }
    if !donator.is_signer {
        msg!("donator should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }
    let mut campaign_data = CampaignDetails::try_from_slice(*writing_account.data.borrow())
        .expect("Error deserialaizing data");

    //campaign_data.campaign_fulfilled += **donator_program_account.lamports.borrow();

    **writing_account.try_borrow_mut_lamports()? += **donator_program_account.lamports.borrow();
    **donator_program_account.try_borrow_mut_lamports()? = 0;

    /*
      let (pda, nonce) = Pubkey::find_program_address(
          &[b"escrow"],
          program_id
      );

      let ix = spl_token::instruction::transfer(
          token_program_id_account.key, // TOKEN PROGRAM ID
          writting_account_associated_account.key, //ASSOCIATED TOKEN ACCOUNT for The writting account
          donator_associated_token_account.key,  //ASSOCIATED TOKEN ACCOUNT donator
          &pda, //
          &[&pda],
          1
      )?;

      msg!("Calling the token program to transfer tokens to donator account");
      invoke_signed(
          &ix,
          &[  writting_account_associated_account.clone(),
              donator_associated_token_account.clone(),
              token_program_id_account.clone()
          ],
          &[&[&b"escrow"[..], &[nonce]]]
      )?;

    */

    campaign_data.serialize(&mut &mut writing_account.data.borrow_mut()[..])?;

    msg!(
        "writing_account = {:?}, 
    donator_program_account = {:?} ,
    donator = {:?},
    donator_associated_token_account = {:?},
    token_program_id_account = {:?},
    writting_account_associated_account = {:?},
    campaign_data_account = {:?}",
        &writing_account.key,
        &donator_program_account.key,
        &donator.key,
        &donator_associated_token_account.key,
        &token_program_id_account.key,
        &writting_account_associated_account.key,
        &campaign_data_account.key
    );
    Ok(())
}

fn create_campaign(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let writing_account = next_account_info(accounts_iter)?; //escrow
    let creator_account = next_account_info(accounts_iter)?; //wallet signer
    let token_program_id = next_account_info(accounts_iter)?; //token acc
    let token_account = next_account_info(accounts_iter)?; //token acc
    //? writting
    if !creator_account.is_signer {
        msg!("creator_account should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }
    // We want to write in this account so we want its owner by the program.

    if writing_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    let rent = Rent::get()?.minimum_balance(writing_account.data_len());
    if **writing_account.lamports.borrow() < rent {
        msg!("The balance of writing_account should be more then rent_exemption");
        return Err(ProgramError::InsufficientFunds);
    }

    // get the minimum balance we need in our program account.
    let input_data = CampaignDetails::try_from_slice(&instruction_data)?;


    /*if input_data.owner != *creator_account.key {
        msg!("Invaild instruction data");
        return Err(ProgramError::InvalidInstructionData);
    } */

    let _ = input_data.serialize(&mut &mut writing_account.data.borrow_mut()[..]);


    let (pda, _nonce) = Pubkey::find_program_address(&[b"escrow"], program_id);

    let owner_change_ix = &spl_token::instruction::set_authority(
        token_program_id.key,  //
        token_account.key, // чета тут. owner does not match
        Some(&pda), //new account
        spl_token::instruction::AuthorityType::AccountOwner,
        creator_account.key,  //signer
        &[&creator_account.key], //signer
    )?;

    msg!("Calling the token program to transfwer token account ownership");
    msg!("owner_change_ix {:?}", &owner_change_ix);

    invoke(
        &owner_change_ix,
        &[
            token_account.clone(),
            creator_account.clone(),
            token_program_id.clone(),
        ],
    )?;

   
    msg!(
        "token_account = {:?} 
        writing_account = {:?}
        creator_account = {:?}
        token_program_id = {:?},",
        &token_account.key,
        &writing_account.key,
        &creator_account.key,
        &token_program_id.key,
    );

    Ok(())
}

fn create_campaign2(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // 0 [signer] the account of the person initializated the escrow
    // 1 [writable] the temporary token account than should be created prior to this instuctions and owned initializer
    // 2 [] the initializer token account
    // 3 [writable]  the escrow account hold info about campaign
    // 4 [] the rent syswar
    // 5 [] the token program

    let accounts_iter = &mut accounts.iter();
    let signer = next_account_info(accounts_iter)?; //signer
    let temp_account = next_account_info(accounts_iter)?; //temp
    let token_account = next_account_info(accounts_iter)?; //token acc
    let escrow_account = next_account_info(accounts_iter)?; //token acc
    let spl_token_account = next_account_info(accounts_iter)?; //token acc


     //? writting
     if !signer.is_signer {
        msg!("signer should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }
    // We want to write in this account so we want its owner by the program.

    if escrow_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }

    let rent = Rent::get()?.minimum_balance(escrow_account.data_len());
    if **escrow_account.lamports.borrow() < rent {
        msg!("The balance of writing_account should be more then rent_exemption");
        return Err(ProgramError::InsufficientFunds);
    }

     // get the minimum balance we need in our program account.
     
    let input_data = CampaignDetails::try_from_slice(&instruction_data)?;

    msg!("serialize data");
    let _ = input_data.serialize(&mut &mut escrow_account.data.borrow_mut()[..]);


    let (pda, _nonce) = Pubkey::find_program_address(&[b"escrow"], program_id);

    let owner_change_ix = &spl_token::instruction::set_authority(
        spl_token_account.key,  //
        temp_account.key, // 
        Some(&pda), //new account
        spl_token::instruction::AuthorityType::AccountOwner,
        signer.key,  //signer
        &[&signer.key], //signer
    )?;

    msg!("Calling the token program to transfwer token account ownership");
    

    // instruction requires an initialized account

    /* invoke(
        &owner_change_ix,
        &[  
            temp_account.clone(),
            signer.clone(),
            spl_token_account.clone()
        ],
    )?;  */

    Ok(())
}