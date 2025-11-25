use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("7sLJJYECWzm1iUE2zEPkD7XtdcUp9qHx3HQPoiUGaicY");

#[error_code]
pub enum TipError {
    #[msg("Tip amount must be greater than 0")]
    InvalidAmount,
    #[msg("Message cannot exceed 280 characters")]
    MessageTooLong,
    #[msg("Message contains invalid characters")]
    InvalidCharacters,
    #[msg("Insufficient SOL balance for this tip")]
    InsufficientFunds,
}

const MAX_MESSAGE_LENGTH: usize = 280;
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBKEY_LENGTH: usize = 32;
const U64_LENGTH: usize = 8;
const I64_LENGTH: usize = 8;
const U8_LENGTH: usize = 1;
const STRING_LENGTH_PREFIX: usize = 4;

#[account]
pub struct TipAccount {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub message: String,
    pub timestamp: i64,
    pub bump: u8,
}

impl TipAccount {
    pub const SPACE: usize = DISCRIMINATOR_LENGTH +
        PUBKEY_LENGTH +
        PUBKEY_LENGTH +
        U64_LENGTH +
        STRING_LENGTH_PREFIX + MAX_MESSAGE_LENGTH +
        I64_LENGTH +
        U8_LENGTH;
}

#[derive(Accounts)]

#[instruction(amount: u64, message: String, seed: u64)]
pub struct SendTip<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(mut)]
    pub recipient: SystemAccount<'info>,

    #[account(
        init,
        payer = sender,
        space = TipAccount::SPACE,
        seeds = [
            b"tip",
            sender.key().as_ref(),
            &seed.to_le_bytes()
        ],
        bump
    )]
    pub tip_account: Account<'info, TipAccount>,

    pub system_program: Program<'info, System>,
}

#[program]
pub mod tip_project {
    use super::*;

    
    pub fn send_tip(
        ctx: Context<SendTip>,
        amount: u64,
        message: String,
        seed: u64, 
    ) -> Result<()> {
        let sanitized_message = sanitize_message(message)?;
        validate_inputs(amount, &sanitized_message)?;

        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp;

        
        transfer_sol(
            &ctx.accounts.sender,
            &ctx.accounts.recipient.to_account_info(),
            amount,
            &ctx.accounts.system_program,
        )?;

        
        initialize_tip_account(
            &mut ctx.accounts.tip_account,
            &ctx.accounts.sender,
            &ctx.accounts.recipient,
            amount,
            sanitized_message,
            timestamp,
            ctx.bumps.tip_account,
        )?;

        msg!("Tip sent successfully! Amount: {}", amount);
        Ok(())
    }
}


fn sanitize_message(message: String) -> Result<String> {
    if message.is_empty() {
        return Ok(String::new());
    }

    let mut sanitized = String::new();

    for c in message.chars() {
        if is_allowed_character(c) {
            sanitized.push(c);
        } else if is_problematic_character(c) {
            sanitized.push(' ');
        } else {
            msg!("Blocked dangerous character: {}", c);
            return Err(TipError::InvalidCharacters.into());
        }
    }

    let sanitized = collapse_whitespace(&sanitized);
    Ok(sanitized)
}

// declaring allowed input for messages

fn is_allowed_character(c: char) -> bool {
    match c {
        'a'..='z' | 'A'..='Z' | '0'..='9' => true,
        ' ' | '.' | ',' | '!' | '?' | ':' | ';' | '-' | '_' | '\'' | '"'
        | '(' | ')' | '[' | ']' | '{' | '}' | '@' | '#' | '$' | '%' | '&'
        | '*' | '+' | '=' | '|' | '~' | '`' | '/' | '\\' | '<' | '>' => true,
        
        'á' | 'é' | 'í' | 'ó' | 'ú' | 'ñ' | 'ü' | 'Á' | 'É' | 'Í' | 'Ó'
        | 'Ú' | 'Ñ' | 'Ü' | 'à' | 'è' | 'ì' | 'ò' | 'ù' | 'À' | 'È' | 'Ì'
        | 'Ò' | 'Ù' | 'â' | 'ê' | 'î' | 'ô' | 'û' | 'Â' | 'Ê' | 'Î' | 'Ô'
        | 'Û' | 'ä' | 'ë' | 'ï' | 'ö' | 'Ä' | 'Ë' | 'Ï' | 'Ö' | 'ÿ' => true,
        _ => false,
    }
}

fn is_problematic_character(c: char) -> bool {
    match c {
        '\t' | '\n' | '\r' => true,
        '\u{200B}' | '\u{200C}' | '\u{200D}' | '\u{FEFF}' => true,
        _ => false,
    }
}

fn collapse_whitespace(s: &str) -> String {
    let mut result = String::new();
    let mut last_was_whitespace = false;

    for c in s.chars() {
        if c.is_whitespace() {
            if !last_was_whitespace {
                result.push(' ');
                last_was_whitespace = true;
            }
        } else {
            result.push(c);
            last_was_whitespace = false;
        }
    }

    result.trim().to_string()
}

fn validate_inputs(amount: u64, message: &str) -> Result<()> {
    require!(amount > 0, TipError::InvalidAmount);

    if !message.is_empty() {
        require!(message.len() <= MAX_MESSAGE_LENGTH, TipError::MessageTooLong);
    }

    Ok(())
}

fn transfer_sol<'info>(
    from: &Signer<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
    system_program: &Program<'info, System>,
) -> Result<()> {
    let cpi_context = CpiContext::new(
        system_program.to_account_info(),
        system_program::Transfer {
            from: from.to_account_info(),
            to: to.to_account_info(),
        },
    );

    system_program::transfer(cpi_context, amount)
}

fn initialize_tip_account(
    tip_account: &mut Account<TipAccount>,
    sender: &Signer,
    recipient: &SystemAccount,
    amount: u64,
    message: String,
    timestamp: i64,
    bump: u8,
) -> Result<()> {
    tip_account.sender = sender.key();
    tip_account.recipient = recipient.key();
    tip_account.amount = amount;
    tip_account.message = message;
    tip_account.timestamp = timestamp;
    tip_account.bump = bump;

    Ok(())
}