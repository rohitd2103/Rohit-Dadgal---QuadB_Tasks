use anchor_lang::prelude::*;

declare_id!("6j9GufhbJz6Pa3umw1UbkPgodc4UEqmNHLniS46M5p44");

#[program]
pub mod firstsolana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
