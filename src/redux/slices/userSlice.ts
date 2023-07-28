import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDelegations, IInitState, IOneDelegatees, IUserAccountData, IUserTypeDetail } from "@/interfaces/user.interface";
import { getAllDelegatees, getBorrowingsHistory, getCurrentDelegation, getDelegationActive, getUserDetailByWallet } from "@/services/userService";
import { getUserAccountData, getUserReserveFromToken } from "@/middleware/dataProvider";
import { getAccount } from '@wagmi/core';
import { IMarketDataProvider } from "@/interfaces/markets.interface";
import { RootState } from "../store";

const initialState:IInitState = {
  userDetail: null,
  loading: false,
  delegations: { delegatees: [] },
  userAccountData: undefined,
  currentDelegation: {},
  showDelegationDialog: false,
  delegatorData: null,
  dataLoaded: false,
  borrowingsHistory: [],
  totalDelegateesDebt: 0,
  existActiveDelegations: false,
}

export const fetchUserDetail = createAsyncThunk(
  'user/fetchUserDetail',
  async (_, { getState, dispatch }) => {
    const state:any = getState();
    const dataLoaded = state.user.dataLoaded;
    const userAccountData: IUserAccountData | undefined = await getUserAccountData(getAccount().address as string);
    dispatch(userSlice.actions.setUserAccountData(userAccountData));
    const userDetail: IUserTypeDetail = await getUserDetailByWallet();
    console.log('userDetail: ', userDetail);
    if (userDetail.isDelegator) {
      await dispatch(fetchDelegatees(userDetail));
    } else {
      const borrowHistory = await getBorrowingsHistory();
      dispatch(userSlice.actions.setBorrowingHistory(borrowHistory));
      const response = await getDelegationActive();
      if (response) {
        const delegatorData: IMarketDataProvider = await getUserReserveFromToken(response?.asset_id as string, 'USDC', response?.delegator_id as string);
        dispatch(userSlice.actions.setDelegatorData(delegatorData));
        const currentDelegation = await getCurrentDelegation(getAccount().address?.toLowerCase() as string, delegatorData.currentVariableDebt)
        dispatch(userSlice.actions.setCurrentDelegation(currentDelegation));
        if (currentDelegation.is_active && !dataLoaded) {
          dispatch(userSlice.actions.setDelegationDialog(true));
        }
        dispatch(userSlice.actions.setDataLoaded(true));
        console.log('currentDelegation: ', currentDelegation);
      }
    }
    return userDetail;
});

export const fetchDelegatees = createAsyncThunk(
  'user/fetchDelegatees',
  async (userDetail: IUserTypeDetail, { getState, dispatch }) => {
    const state = getState() as RootState;
    const currentDelegation = state.user.currentDelegation as IDelegations;
    const delegatees = await getAllDelegatees(userDetail?.company_id);
    let totalDelegateesDebt = 0;
    const isActiveDelegationPresent = delegatees.delegatees
      .some(delegate => delegate.delegations
        .find(delegation => delegation.is_active));

    delegatees.delegatees.map((delegate:IOneDelegatees) => {
      delegate.delegations.map((delegation:IDelegations) => {
        if (delegation.delegation_id === currentDelegation?.delegation_id) {
          dispatch(setCurrentDelegation(delegation));
        }
        totalDelegateesDebt += delegation.total_debt;
      })
    })
    dispatch(userSlice.actions.setDelegations(delegatees));
    dispatch(userSlice.actions.setTotalDelegateesDebt(totalDelegateesDebt));
    dispatch(userSlice.actions.setExistActiveDelegations(isActiveDelegationPresent));
  }
)

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setTotalDelegateesDebt: (state, action) => {
      state.totalDelegateesDebt = action.payload;
    },
    setExistActiveDelegations: (state, action) => {
      state.existActiveDelegations = action.payload;
    },
    setDelegations: (state, action) => {
      state.delegations = action.payload;
    },
    setBorrowingHistory: (state, action) => {
      state.borrowingsHistory = action.payload;
    },
    setDataLoaded: (state, action) => {
      state.dataLoaded = action.payload;
    },
    setDelegatorData: (state, action) => {
      state.delegatorData = action.payload;
    },
    setDelegationDialog: (state, action) => {
      state.showDelegationDialog = action.payload;
    },
    setUserAccountData: (state, action) => {
      state.userAccountData = action.payload;
    },
    setCurrentDelegation: (state, action) => {
      state.currentDelegation = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.userDetail = action.payload;
        state.loading = false;
      })
  },
})

export const { setDelegationDialog, setCurrentDelegation } = userSlice.actions;
export default userSlice.reducer;