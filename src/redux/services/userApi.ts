import { FetchBaseQueryMeta, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IMarketDataProvider } from '../../interfaces/markets.interface';
import { reduceDecimals } from '../../utils/reduceDecimals';
import { MARKET_RESERVE_GQL } from '../../graphql/marketReserve';

const factor = 1e27;

// Define tus types
type MarketReserveResponse = {
  pools: {
    reserves: {
      id: string,
      symbol: string,
      liquidityRate: number,
      stableBorrowRate: number,
      variableBorrowRate: number,
      baseLTVasCollateral: number,
      price: { priceInEth: number }
    }[]
  }[]
}

export const marketReserveApi = createApi({
  reducerPath: 'marketReserveApi',
  baseQuery: fetchBaseQuery({
      baseUrl: 'https://your-graphql-server.com/' // Cambia a la URL de tu servidor GraphQL
  }),
  endpoints: (builder) => ({
    getMarketReserve: builder.query<IMarketDataProvider[], { id: string }>({
        query: ({ id }) => ({
          url: '', // La ruta se asume que está vacía ya que la URL del servidor GraphQL ya está establecida en baseUrl
          method: 'POST',
          body: {
            query: MARKET_RESERVE_GQL,
            variables: { id },
          },
        }),
        transformResponse: (baseQueryReturnValue: any) => {
          if (
            baseQueryReturnValue &&
            baseQueryReturnValue.data &&
            baseQueryReturnValue.data.pools &&
            Array.isArray(baseQueryReturnValue.data.pools)
          ) {
            const factor = 1e27;
            return baseQueryReturnValue.data.pools[0]?.reserves.map((result: any) => ({
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
              price: reduceDecimals(Number(result.price.priceInEth) / 1e18),
              maxToBorrowInUSD: 0,
              maxToBorrowInToken: 0,
            }));
          } else {
            return [];
          }
        },
        
    }),
  }) 
})

export const { useGetMarketReserveQuery } = marketReserveApi;
