// validationRules.js

import { useAppSelector } from "@/redux/hooks";
import { ACTION } from "@/constants";
import { IActionType } from "@/interfaces/actions.interface";
import { IMarketDataProvider } from "@/interfaces/markets.interface";
import { IDelegations, IOneDelegatees, IUserTypeDetail } from "@/interfaces/user.interface";
import { RootState } from "@/redux/store";

const depositRule = (currentAction: IActionType, currentMarket:IMarketDataProvider) => (value:number) =>
  currentAction === ACTION.DEPOSIT && value > (currentMarket?.balanceInWallet || 0)
    ? 'No puedes depositar mas de lo que tienes en la billetera'
    : null;
const nonNegative = () => (value:number) => value < 0 ? 'El valor ingresado no puede ser negativo' : null;

const validValue = () => (value:number) => value === 0 ? 'Ingresa un valor valido' : null;

const delegationRule = (currentAction:IActionType, delegatee:IOneDelegatees) => (value:number) =>
  currentAction === ACTION.DELEGATION && !delegatee ? 'Ingresa un delegado' : null;

const maxBorrow = (currentDelegation:IDelegations, userDetail:IUserTypeDetail, currentAction:IActionType) => (value:number) => 
  currentAction === ACTION.BORROW && !userDetail?.isDelegator && ((currentDelegation.amount - currentDelegation.total_borrow) < value)
  ? 'No puedes pedir esa cantidad': null;

const maxRepay = (currentDelegation:IDelegations, userDetail:IUserTypeDetail, currentAction:IActionType) => (value:number) => 
  currentAction === ACTION.REPAY && !userDetail?.isDelegator && (value > currentDelegation.total_debt)
  ? 'No debes tanto': null;

export function useValidationRules(currentAction:IActionType, currentMarket:IMarketDataProvider, delegatee: IOneDelegatees) {
  const currentDelegation = useAppSelector((state:RootState) => state.user.currentDelegation) as IDelegations
  const userDetail = useAppSelector((state:RootState) => state.user.userDetail) as IUserTypeDetail
  return [
    depositRule(currentAction, currentMarket),
    validValue(),
    nonNegative(),
    delegationRule(currentAction, delegatee),
    maxBorrow(currentDelegation,  userDetail, currentAction),
    maxRepay(currentDelegation,  userDetail, currentAction)
  ];
}
