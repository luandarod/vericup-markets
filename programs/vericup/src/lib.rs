use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount, Transfer},
};

declare_id!("BgJSdxW7zKzg5r5sctQoxEbc73pEeiaFGj3ebqvR8gnd");

const PLAY_DECIMALS: u8 = 6;
const DEMO_PLAY_AMOUNT: u64 = 1_000 * 10_u64.pow(PLAY_DECIMALS as u32);

#[program]
pub mod vericup {
    use super::*;

    pub fn initialize_protocol(ctx: Context<InitializeProtocol>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.play_mint = ctx.accounts.play_mint.key();
        config.bump = ctx.bumps.config;
        Ok(())
    }

    pub fn claim_demo_tokens(ctx: Context<ClaimDemoTokens>) -> Result<()> {
        let signer_seeds: &[&[u8]] = &[b"config", &[ctx.accounts.config.bump]];
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.play_mint.to_account_info(),
                    to: ctx.accounts.user_play.to_account_info(),
                    authority: ctx.accounts.config.to_account_info(),
                },
                &[signer_seeds],
            ),
            DEMO_PLAY_AMOUNT,
        )?;

        let receipt = &mut ctx.accounts.faucet_receipt;
        receipt.user = ctx.accounts.user.key();
        receipt.bump = ctx.bumps.faucet_receipt;
        Ok(())
    }

    pub fn create_market(ctx: Context<CreateMarket>, fixture_id: u64, kickoff: i64) -> Result<()> {
        require!(
            kickoff > Clock::get()?.unix_timestamp,
            VeriCupError::InvalidKickoff
        );

        let market = &mut ctx.accounts.market;
        market.fixture_id = fixture_id;
        market.kickoff = kickoff;
        market.play_mint = ctx.accounts.play_mint.key();
        market.vault = ctx.accounts.vault.key();
        market.state = MarketState::Open;
        market.pools = [0; 3];
        market.resolved_outcome = None;
        market.proof_hash = [0; 32];
        market.resolution_slot = 0;
        market.claimed_winning_stake = 0;
        market.claimed_payout = 0;
        market.bump = ctx.bumps.market;
        Ok(())
    }

    pub fn take_position(ctx: Context<TakePosition>, outcome: Outcome, amount: u64) -> Result<()> {
        require!(amount > 0, VeriCupError::InvalidAmount);
        require!(
            ctx.accounts.market.state == MarketState::Open,
            VeriCupError::MarketClosed
        );
        require!(
            Clock::get()?.unix_timestamp < ctx.accounts.market.kickoff,
            VeriCupError::MarketClosed
        );

        let outcome_index = outcome.index();
        let position = &mut ctx.accounts.position;
        if position.amount == 0 {
            position.owner = ctx.accounts.user.key();
            position.market = ctx.accounts.market.key();
            position.outcome = outcome;
            position.bump = ctx.bumps.position;
        }
        position.amount = position
            .amount
            .checked_add(amount)
            .ok_or(VeriCupError::ArithmeticOverflow)?;

        let market = &mut ctx.accounts.market;
        market.pools[outcome_index] = market.pools[outcome_index]
            .checked_add(amount)
            .ok_or(VeriCupError::ArithmeticOverflow)?;

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_play.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )
    }
}

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + ProtocolConfig::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, ProtocolConfig>,
    #[account(
        mut,
        constraint = play_mint.decimals == PLAY_DECIMALS @ VeriCupError::InvalidPlayMint,
        constraint = play_mint.mint_authority == anchor_lang::solana_program::program_option::COption::Some(config.key()) @ VeriCupError::InvalidPlayMint
    )]
    pub play_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimDemoTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, ProtocolConfig>,
    #[account(mut, address = config.play_mint)]
    pub play_mint: Account<'info, Mint>,
    #[account(
        mut,
        token::mint = play_mint,
        token::authority = user
    )]
    pub user_play: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = user,
        space = 8 + FaucetReceipt::INIT_SPACE,
        seeds = [b"faucet", config.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub faucet_receipt: Account<'info, FaucetReceipt>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fixture_id: u64)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [b"config"],
        bump = config.bump,
        has_one = authority,
        has_one = play_mint
    )]
    pub config: Account<'info, ProtocolConfig>,
    pub play_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = authority,
        space = 8 + Market::INIT_SPACE,
        seeds = [b"market".as_ref(), fixture_id.to_le_bytes().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = play_mint,
        associated_token::authority = market
    )]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(outcome: Outcome)]
pub struct TakePosition<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"market".as_ref(), market.fixture_id.to_le_bytes().as_ref()],
        bump = market.bump
    )]
    pub market: Account<'info, Market>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Position::INIT_SPACE,
        seeds = [b"position".as_ref(), market.key().as_ref(), user.key().as_ref(), &[outcome.index() as u8]],
        bump
    )]
    pub position: Account<'info, Position>,
    #[account(
        mut,
        token::mint = market.play_mint,
        token::authority = user
    )]
    pub user_play: Account<'info, TokenAccount>,
    #[account(mut, address = market.vault)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct ProtocolConfig {
    pub authority: Pubkey,
    pub play_mint: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct FaucetReceipt {
    pub user: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub fixture_id: u64,
    pub kickoff: i64,
    pub play_mint: Pubkey,
    pub vault: Pubkey,
    pub state: MarketState,
    pub pools: [u64; 3],
    pub resolved_outcome: Option<Outcome>,
    pub proof_hash: [u8; 32],
    pub resolution_slot: u64,
    pub claimed_winning_stake: u64,
    pub claimed_payout: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Position {
    pub owner: Pubkey,
    pub market: Pubkey,
    pub outcome: Outcome,
    pub amount: u64,
    pub claimed: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum MarketState {
    Open,
    Locked,
    Resolved,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum Outcome {
    Home,
    Draw,
    Away,
}

impl Outcome {
    fn index(self) -> usize {
        match self {
            Self::Home => 0,
            Self::Draw => 1,
            Self::Away => 2,
        }
    }
}

#[error_code]
pub enum VeriCupError {
    #[msg("The PLAY mint is not configured for this protocol")]
    InvalidPlayMint,
    #[msg("Kickoff must be in the future")]
    InvalidKickoff,
    #[msg("Position amount must be greater than zero")]
    InvalidAmount,
    #[msg("Market is not accepting positions")]
    MarketClosed,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}
