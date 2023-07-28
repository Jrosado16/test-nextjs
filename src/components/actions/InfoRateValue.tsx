import React from 'react';
import { IMarketDataProvider } from '../../interfaces/markets.interface';
import { IActionType } from '../../interfaces/actions.interface';
import { reduceDecimals } from '../../utils/reduceDecimals';
import { IDelegations, IUserTypeDetail } from '@/interfaces/user.interface';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { ACTION } from '@/constants';

const valueLabel = {
  deposit: 'Tienes en tu billetera',
  withdraw: 'Puedes retirar',
  borrow: 'Puedes pedir hasta',
  delegation: 'Puedes delegar',
  repay: 'Debes pagar',
  [ACTION.REPAY_DEBT_DELEGATION]: 'Debes pagar',
};

const rateLabel = {
  deposit: 'Rendimiento anual',
  withdraw: 'Puedes retirar',
  borrow: 'Interés anual',
  delegation: 'Interés anual',
  repay: 'Rendimiento anual',
  [ACTION.REPAY_DEBT_DELEGATION]: 'Rendimiento anual',
};

const rateValue = {
  deposit: (market: IMarketDataProvider) => market?.liquidityRate,
  withdraw: (market: IMarketDataProvider) => market?.liquidityRate,
  borrow: (market: IMarketDataProvider) => market?.variableBorrowRate,
  repay: (market: IMarketDataProvider) => market?.variableBorrowRate,
  delegation: (market: IMarketDataProvider) => market?.variableBorrowRate,
  [ACTION.REPAY_DEBT_DELEGATION]: (market: IMarketDataProvider) => market?.variableBorrowRate,
};

const actionAmounts = {
  deposit: (market: IMarketDataProvider) => market?.balanceInWallet,
  withdraw: (market: IMarketDataProvider) => market?.currentATokenBalance,
  borrow: (market: IMarketDataProvider) => reduceDecimals(market?.maxToBorrowInToken, market?.symbol),
  delegation: (market: IMarketDataProvider) => reduceDecimals(market?.maxToBorrowInToken, market?.symbol),
  repay: (market: IMarketDataProvider) => market?.currentVariableDebt,
  [ACTION.REPAY_DEBT_DELEGATION]: (market: IMarketDataProvider) => market?.variableBorrowRate,
};

type Props = {
  currentAction: IActionType
  currentMarket: IMarketDataProvider
  userDetail: IUserTypeDetail
}

export default function   InfoRateValue({ currentAction, currentMarket, userDetail }: Props) {
  const currentDelegation = useAppSelector((state:RootState) => state.user.currentDelegation) as IDelegations
  return (
    <div className='flex justify-between mt-8'>
      <div>
        <div className='text-[12px]'>
          { rateLabel[currentAction] }
        </div>          
        <div className='font-bold text-[20px] leading-none'>
          { rateValue[currentAction](currentMarket) }%
        </div>
      </div>
      <div>
        <div className='text-[12px]'>
          { valueLabel[currentAction] }
        </div>          
        <div className='font-bold text-[20px] leading-none'>
          {
            (userDetail?.isDelegator && currentAction !== ACTION.REPAY_DEBT_DELEGATION) && actionAmounts[currentAction](currentMarket)
          }
          {
            (!userDetail?.isDelegator && currentAction === ACTION.REPAY) && currentDelegation.total_debt
          }
          {
            (!userDetail?.isDelegator && currentAction === ACTION.BORROW)
              && currentDelegation.amount - currentDelegation.total_borrow
          }
          {
            (userDetail?.isDelegator && currentAction === ACTION.REPAY_DEBT_DELEGATION)
              && currentDelegation.total_debt
          }
          &nbsp;{ currentMarket?.symbol }
        </div>
      </div>
    </div>
  )
}
