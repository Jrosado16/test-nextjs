import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IMarketDataProvider } from "@/interfaces/markets.interface";
import { waitForTransaction, getAccount } from '@wagmi/core';
import Market from "@/contracts/Market";
import WETHMarket from "@/contracts/wethMarket";
import { IActionState, IActionType, ITransaction } from "@/interfaces/actions.interface";
import { ACTION } from "@/constants";
// UPDATE ACTION IN FIREBASE FUNCTIONS
import { setActionFunctionBorrow, setActionFunctionDelegation, setActionFunctionDeposit, setActionFunctionRepay } from "../../services/userService";
import { IDelegations, IUserTypeDetail } from "@/interfaces/user.interface";
import { fetchUserDetail } from "./userSlice";

const initialState: IActionState = {
  transaction: {
    amount: 0,
    hash: '',
    step: 1,
    type: 'deposit',
    error: false,
    token: ''
  },
  isOpenDialogTx: false,
  loadingAction: false,
}
type FactoryMarket =  WETHMarket | Market;

const MarketInstance:any = {
  'USDC': (address: string) => new Market(address),
  'WBTC': (address: string) => new Market(address),
  'WETH': (address: string) => new WETHMarket(address),
};

interface IActionPayload {
  amount: number;
  action: string;
  borrowerAddress?: string
}

export const setDispatchAction = createAsyncThunk(
  'action/setDispatchAction', 
  async ({ amount, action, borrowerAddress }: IActionPayload, { getState, dispatch }) => {
    const params = {
      amount,
      step: 1,
      type: action as IActionType,
      hash: '',
      error: false,
      token: ''
    }
    try {
      const state: any = getState();
      const currentMarket: IMarketDataProvider = state.markets.currentMarket;
      const userDetail: IUserTypeDetail = state.user.userDetail;
      const delegatorData: IMarketDataProvider = state.user.delegatorData;
      const currentDelegation: IDelegations = state.user.currentDelegation;
      const usdcMarket: IMarketDataProvider = state.markets.usdcMarket;
      const instance: FactoryMarket = MarketInstance[currentMarket.symbol](currentMarket.tokenAddress);

      params.token = currentMarket.symbol;
      dispatch(actionSlice.actions.setTxDialog(true));
      dispatch(actionSlice.actions.setTransaction(params));
      dispatch(actionSlice.actions.setLoadingAction(true));
      let walletAddress:string = currentDelegation.delegator_id; 
      let tx: any;
      switch(action) {
        case ACTION.DEPOSIT:
          tx = await instance.deposit(amount);
          await setActionFunctionDeposit(tx, amount);
          break;
        case ACTION.WITHDRAW:
          tx = await instance.withdraw(amount);
          break;
        case ACTION.BORROW:
          if (userDetail.isDelegator) walletAddress = getAccount().address?.toLowerCase() as string;
          tx = await instance.borrow(amount, walletAddress);
          await setActionFunctionBorrow(tx, amount, delegatorData.currentVariableDebt, currentDelegation)
          break;
        case ACTION.DELEGATION:
          tx = await instance.approveDelegation(amount, borrowerAddress as string)
          await setActionFunctionDelegation(tx, amount, borrowerAddress as string);
          break;
        case ACTION.REPAY:
        case ACTION.REPAY_DEBT_DELEGATION:
          if (userDetail.isDelegator) walletAddress = getAccount().address?.toLowerCase() as string;
          tx = await instance.repay(amount, walletAddress);
          await setActionFunctionRepay(tx, amount, delegatorData?.currentVariableDebt || usdcMarket.currentVariableDebt, currentDelegation);
          break;
        default:
          throw new Error("Invalid action");
      }
      // await new Promise((resolve) => setTimeout(() => resolve(''), 3000))
      params.step = 2;
      dispatch(actionSlice.actions.setTransaction(params));
      await waitForTransaction({ hash: tx.hash });
      await dispatch(fetchUserDetail());
      dispatch(actionSlice.actions.setLoadingAction(false));
      params.hash = tx.hash;
      params.step = 2;
      dispatch(actionSlice.actions.setTransaction(params));

      return tx;
    } catch (error) {
      console.log('error: ', error);
      params.error = true;
      params.step = 4 // only show the error;
      dispatch(actionSlice.actions.setTransaction(params));
    }
  }
);

export const actionSlice = createSlice({
    name: 'actionSlice',
    initialState,
    reducers: {
      setTransaction: (state, action:PayloadAction<ITransaction>) => {
        state.transaction = { ...state.transaction, ...action.payload };
      },
      setTxDialog: (state, action) => {
        state.isOpenDialogTx = action.payload
      },
      setLoadingAction: (state, action) => {
        state.loadingAction = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder.addCase(setDispatchAction.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.transaction.step = 3;
        state.transaction.hash = action.payload?.hash;
      })
      .addCase(setDispatchAction.rejected, (state, action) => {
      });
    },
  
}) 

export const { setTransaction, setTxDialog } = actionSlice.actions;
export default actionSlice.reducer