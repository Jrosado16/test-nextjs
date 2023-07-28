import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserReserveData } from '@/middleware/dataProvider';
import { IMarketDataProvider } from '@/interfaces/markets.interface';
import { reduceDecimals } from "@/utils/reduceDecimals";
import { ZK_TOKENS } from "@/constants";
import { RootState } from "../store";

interface MarketState {
  loading: boolean;
  markets: IMarketDataProvider[];
  currentMarket: IMarketDataProvider | undefined,
  totalInWalletInUSD: number,
  usdcMarket: IMarketDataProvider | null
}

const initialState: MarketState = {
  loading: false,
  markets: [],
  currentMarket: undefined,
  totalInWalletInUSD: 0,
  usdcMarket: null,
};

export const fetchMarkets = createAsyncThunk(
  'data/fetchMarkets',
  async (marketsPools:IMarketDataProvider[], { getState, dispatch }) => {
    const response = await getUserReserveData();
    const store = getState() as RootState;
    let totalInWalletInUSD = 0;
    const markets = marketsPools.map((market:IMarketDataProvider) => {
      const mkt = response?.filter((mkt:IMarketDataProvider) => mkt.symbol === market.symbol)[0];
      totalInWalletInUSD += mkt?.balanceInWalletInUSD || 0;
      if (store.user.userDetail?.isDelegator && mkt && mkt?.currentVariableDebt !== undefined) {
        mkt.currentVariableDebt -= store.user.totalDelegateesDebt; 
      }
      return { ...market, ...mkt };
    })
    totalInWalletInUSD = reduceDecimals(totalInWalletInUSD);
    dispatch(marketSlice.actions.setTotalInWallet(totalInWalletInUSD))
    return markets;
});

export const fetchUserReserve = createAsyncThunk('data/fetchUserReserve', async () => {
  const response = await getUserReserveData();
  return response || [];
});

export const marketSlice = createSlice({
  name: 'marketSlice',
  initialState: initialState,
  reducers: {
    setMarketSlice: (state: MarketState, action:any) => {
      state.markets = action.payload;
    },
    setTotalInWallet: (state: MarketState, action) => {
      state.totalInWalletInUSD = action.payload;
    },
    setCurrentMarketSlice: (state: MarketState, action:PayloadAction<IMarketDataProvider>) => {
      state.currentMarket = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReserve.fulfilled, (state, action) => {
        state.markets = action.payload;
        const symbol = state.currentMarket?.symbol || ZK_TOKENS.USDC;
        const currentMarket = action.payload?.filter((market:IMarketDataProvider) => market.symbol === symbol)[0];
        state.currentMarket = { ...state.currentMarket, ...currentMarket };
        state.usdcMarket = action.payload?.filter((market:IMarketDataProvider) => market.symbol === ZK_TOKENS.USDC)[0];
      })
      .addCase(fetchMarkets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarkets.fulfilled, (state, action) => {
        state.markets = action.payload;
        const symbol = state.currentMarket?.symbol || ZK_TOKENS.USDC;
        const currentMarket = action.payload?.filter((market:IMarketDataProvider) => market.symbol === symbol)[0];
        state.currentMarket = { ...state.currentMarket, ...currentMarket };
        state.usdcMarket = action.payload?.filter((market:IMarketDataProvider) => market.symbol === ZK_TOKENS.USDC)[0];
        state.loading = false;
      })
      .addCase(fetchMarkets.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setMarketSlice, setCurrentMarketSlice } = marketSlice.actions;
export default marketSlice.reducer;