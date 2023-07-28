import { gql } from '@apollo/client';

export const USER_RESERVE_GQL =  gql`query UserReserves($user: String!) {
  userReserves(where: { user: $user }) {
    id
    reserve {
      id
      symbol
      decimals
      totalCurrentVariableDebt
      totalPrincipalStableDebt
      totalDeposits
      lastUpdateTimestamp
      lifetimeBorrows
      lifetimeDepositorsInterestEarned
      lifetimeLiquidity
      lifetimeRepayments
      lifetimeWithdrawals
      totalLiquidity
      liquidityRate
      stableBorrowRate
      variableBorrowRate
      price {
        id
        priceInEth
        priceSource
      }
    }
    # user {
    #   id
    # }
    # borrowHistory {
    #   amount
    #   assetPriceUSD
    #   reserve {
    #     symbol
    #     decimals
    #   }
    # }
    # repayHistory {
    #   amount
    #   assetPriceUSD
    #   reserve {
    #     symbol
    #     decimals
    #   }
    # }
    # currentTotalDebt
    # currentATokenBalance
    # depositHistory {
    #   amount
    #   assetPriceUSD
    #   reserve {
    #     symbol
    #     decimals
    #   }
    # }
  }
}`