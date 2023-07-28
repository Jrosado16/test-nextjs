'use client'
import React, { useCallback, useEffect, useState } from 'react';
import CustomButton from '@/components/General/buttons/CustomButton';
import CustomInput from '@/components/General/CustomInput';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { IMarketDataProvider } from '@/interfaces/markets.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentMarketSlice } from '@/redux/slices/marketSlice';
import { setDispatchAction } from '@/redux/slices/actionSlice';
import { ACTION, ACTION_LABELS } from '@/constants';
import { IActionType } from '@/interfaces/actions.interface';
import { BackButton } from '@/components/actions/BackButton';
import { MarketDropdown } from '@/components/actions/MarketDropdown';
import InfoRateValue from '@/components/actions/InfoRateValue';
import TitleAction from '@/components/actions/TitleAction';
import { useValidationRule } from '@/hooks/useValidationRule';
import { useValidationRules } from '@/rules/useValidationRules';
import { NextPage } from 'next';
import { RootState } from '@/redux/store';
import CustomDropdown from '@/components/General/dropdown/CustomDropdown';
import DelegateeDialog from '@/components/dialog/DelegateeDialog';
import { IDelegateesWithDelegations, IDelegations, IOneDelegatees, IUserTypeDetail } from '@/interfaces/user.interface';
import DropdownDelegator from '@/components/actions/Delegations/DropdownDelegator';
import DropdownAction from '@/components/actions/Delegations/DropdownAction';

const Index: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const getParams = useSearchParams();

  const markets:IMarketDataProvider[] = useAppSelector((state:RootState) => state.markets.markets);
  const userDetail = useAppSelector((state:RootState) => state.user.userDetail) as IUserTypeDetail;
  const loadingUserDetail = useAppSelector((state:RootState) => state.user.loading);
  const currentDelegation = useAppSelector((state:RootState) => state.user.currentDelegation) as IDelegations

  const delegations:IDelegateesWithDelegations = useAppSelector((state:RootState) => state.user.delegations) as IDelegateesWithDelegations
  const [delegateeDialog, setDelegateeDialog] = useState<boolean>(false);
  const [delegatee, setDelegatee] = useState<IOneDelegatees>();

  const currentMarket:IMarketDataProvider | undefined = useAppSelector((state:RootState) => state.markets.currentMarket);
  const [currentAction, setCurrentAction] = useState<IActionType>(() => getParams.get('name') as IActionType || 'deposit');
  const dispatch = useAppDispatch()
  
  const { value, alerts, handleChange, activeButton, setValue, validate } = useValidationRule(
    0,
    useValidationRules(currentAction, currentMarket as IMarketDataProvider, delegatee as IOneDelegatees)
  );
  
  const handleMarket = useCallback((market:IMarketDataProvider) => {
    dispatch(setCurrentMarketSlice(market));
  }, [dispatch]);

  useEffect(() => {
    const market:any = markets.find((mkt:IMarketDataProvider) => mkt.tokenAddress === params.id);
    handleMarket(market);
    validate(Number(value));
  }, [handleMarket, delegatee, value, currentAction, loadingUserDetail]);

  const handleDelegatee = (delegatee:IOneDelegatees) => {
    setDelegatee(delegatee)
  }
  
  const setMax = () => {
    const actionToPropertyMap: { [key in IActionType]?: keyof IMarketDataProvider } = {
      [ACTION.DEPOSIT]: 'balanceInWallet',
      [ACTION.WITHDRAW]: 'currentATokenBalance',
      [ACTION.BORROW]: 'maxToBorrowInToken',
      [ACTION.DELEGATION]: 'maxToBorrowInToken',
      [ACTION.REPAY]: 'currentVariableDebt',
      [ACTION.REPAY_DEBT_DELEGATION]: 'REPAY_DEBT_DELEGATION',
    };
    const property = actionToPropertyMap[currentAction];
    console.log('property: ', property);
    if (!property) {
      throw new Error(`Invalid action: ${currentAction}`);
    }
    let maxValue = currentMarket?.[property] || 0;
    if (!userDetail.isDelegator && currentAction === ACTION.BORROW) {
      maxValue = currentDelegation.amount - currentDelegation.total_borrow;
    } else if (!userDetail.isDelegator && currentAction === ACTION.REPAY) {
      maxValue = currentDelegation.total_borrow;
    }
    if (currentAction === ACTION.REPAY_DEBT_DELEGATION) {
      maxValue = currentDelegation.total_debt;
    }

    setValue(Number(maxValue) || 0);
    validate(Number(maxValue) || 0);
  }

  const handleActionMarket = () => {
    if (!activeButton) return;
    dispatch(setDispatchAction({ amount: Number(value), action: currentAction, borrowerAddress: delegatee?.delegatee_id }));
    setDelegatee(undefined);
  }

  const handleSetCurrectAction = (action: string) => {
    router.push(`/actions/${currentMarket?.tokenAddress}?name=${action}`);
    setCurrentAction(action as IActionType);
  }
  return (
    <div className='mt-9 w-[291px] m-auto text-text md:w-[544px] md:border md:border-line rounded-[30px]'>
      <div className='flex md:mt-9'>
        <BackButton />
        <TitleAction currentAction={currentAction} />
      </div>
      <div className='mt-11 md:w-[314px] md:pb-9 m-auto'>
        {
          userDetail?.isDelegator && 
          (
            <div className='flex justify-between'>
              <MarketDropdown 
                markets={markets} 
                currentMarket={currentMarket as IMarketDataProvider} 
                handleMarket={handleMarket} 
              />
              {
                (currentAction === ACTION.DELEGATION || currentAction === ACTION.BORROW) &&
                <DropdownAction handleSetCurrectAction={handleSetCurrectAction} currentAction={currentAction} />
              }
            </div>
          )
        }
        <InfoRateValue currentAction={currentAction} currentMarket={currentMarket as IMarketDataProvider} userDetail={userDetail} />
        <div className='mt-8 md:flex md:flex-col'>
          <div className='mb-2 text-[12px]'>Escribir cantidad</div>
          <CustomInput onClick={() => setMax()} value={value} onChange={handleChange}/>
          { Number(value) !== undefined && Number(value) > 0 && alerts.map((alert, index) => (
            <div key={index} className='text-text text-[12px]'>
              {alert}
            </div>
          ))}
          {
            currentAction === ACTION.DELEGATION &&
            <div className='mt-5'>
              <div className='text-[12px]'>Selecciona un delegado</div>
              <DropdownDelegator delegatee={delegatee  as IOneDelegatees} delegations={delegations} handleDelegatee={handleDelegatee} />
              <button onClick={() => setDelegateeDialog(true)} className='underline text-center mt-4 cursor-pointer m-auto flex'>Agregar delegado</button>
            </div>
          }
          <CustomButton type={`${activeButton ? 'primary' : 'disabled'}`} onClick={() => handleActionMarket()} className='w-[291px] h-[38px] mt-9 m-auto'>
            { currentAction === ACTION.REPAY_DEBT_DELEGATION ? 'Pagar' : ACTION_LABELS[currentAction] }
          </CustomButton>
        </div>
      </div>
      <DelegateeDialog isOpen={delegateeDialog} onClose={() => setDelegateeDialog(false)} />
    </div>
  )
}

export default Index;