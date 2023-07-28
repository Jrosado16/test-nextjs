import USDCMarket from "../contracts/Market";
import WETHMarket from "../contracts/wethMarket";

export interface IMarketDataProvider {
  symbol: 'USDC' | 'WBTC' | 'WETH',
  tokenAddress: string,
  balanceInWallet: number,
  currentATokenBalance: number
  currentStableDebt: number
  currentVariableDebt: number
  principalStableDebt: number
  scaledVariableDebt: number
  stableBorrowRate: number
  liquidityRate: number
  stableRateLastUpdated: number
  usageAsCollateralEnabled: boolean
  variableBorrowRate: number
  baseLTVasCollateral: number
  price: number
  maxToBorrowInUSD: number
  maxToBorrowInToken: number
  balanceInWalletInUSD: number
}

export interface IMarketInstance{
  deposit(amount: number): Promise<any>
  withdraw(amount: number): Promise<any>
  borrow(amount: number, walletAddress: string): Promise<any>
  repay(amount: number, walletAddress:string): Promise<any>
}