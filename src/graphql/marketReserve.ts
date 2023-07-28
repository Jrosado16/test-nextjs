import { gql } from '@apollo/client';

export const MARKET_RESERVE_GQL =  gql`query ReservesState($id: ID = "") {
  pools(where: {id: $id}) {
    id
    reserves {
      id
      symbol
      totalCurrentVariableDebt
      totalPrincipalStableDebt
      totalDeposits
      decimals
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
      baseLTVasCollateral
      price {
        id
        priceInEth
        priceSource
      }
    }
  }
}`