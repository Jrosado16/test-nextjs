import client from '../adapters/apolloClient';
import { useQuery } from "@apollo/client";
import { MARKET_RESERVE_GQL } from '../graphql/marketReserve';
import { contracts } from '../constants';
import { getNetwork } from '@wagmi/core';
import { IMarketDataProvider } from '../interfaces/markets.interface';
import { reduceDecimals } from '../utils/reduceDecimals';

interface IMarketReserve {
  liquidityRate: number,
  symbol: number,
  tokenAddress: string,
  stableBorrowRate: number,
  variableBorrowRate: number,
}

export const useMarketReserve = () => {
  const { chain } = getNetwork();
  const defaultChainId:number = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAINID);
  const addressProvider = contracts[chain?.id || defaultChainId]?.LENDING_POOL_ADDRESS_PROVIDER || '';
  const { loading, error, data } = useQuery(
    MARKET_RESERVE_GQL,
    {
      variables: { 
        id: addressProvider.toLowerCase(),
      }, 
      client 
    },
  );
  
  if (loading) return { loading };
  if (error) return { error };
  const factor = 1e27;
  const response = data.pools[0]?.reserves.map((result:any) => {
    return {
      tokenAddress: result.id,
      symbol: result.symbol,
      liquidityRate: reduceDecimals((Number(result.liquidityRate) / factor) * 100),
      stableBorrowRate: reduceDecimals((Number(result.stableBorrowRate) / factor) * 100),
      variableBorrowRate: reduceDecimals((Number(result.variableBorrowRate) / factor) * 100),
      balanceInWallet: 0,
      currentATokenBalance: 0,
      currentStableDebt: 0,
      currentVariableDebt: 0,
      principalStableDebt: 0,
      scaledVariableDebt: 0,
      stableRateLastUpdated: 0,
      usageAsCollateralEnabled: false,
      baseLTVasCollateral: reduceDecimals((Number(result.baseLTVasCollateral) / 1e4) * 100),
      price: reduceDecimals(Number(result.price.priceInEth) / 1e18)
    } as IMarketDataProvider;
  });
  
  return { data: response };
}