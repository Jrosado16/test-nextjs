import React from 'react'
import { IDelegations, IOneDelegatees } from '../../../interfaces/user.interface'
import CustomButton from '../../General/buttons/CustomButton'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentDelegation } from '@/redux/slices/userSlice'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { ACTION } from '@/constants'

type Props = {
  delegatee: IOneDelegatees
  delegation: IDelegations
}

export default function Delegation({ delegatee, delegation }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const usdcMarket = useAppSelector((state:RootState) => state.markets.usdcMarket);
  const setDelegation = (delegation:IDelegations) => {
    dispatch(setCurrentDelegation(delegation));
    router.push(`/actions/${usdcMarket?.tokenAddress}?name=${ACTION.REPAY_DEBT_DELEGATION}`)
  }
  return (
    <div className='flex justify-between text-text mt-8'>
      <div className='w-1/5'>
        <div className='text-frame'>Delegado</div>
        <div className='text-[16px]'>{delegatee.email}</div>
      </div>
      <div>
        <div className='text-frame'>Monto delegado</div>
        <div className='text-[30px]'>
          {delegation.amount}
          <span className='text-[15px]'>USD</span>
        </div>
      </div>
      <div>
        <div className='text-frame'>Interés anual</div>
        <div className='text-[30px]'>
          {usdcMarket?.variableBorrowRate}
          <span className='text-[15px]'>%</span>
        </div>
      </div>
      <div>
        <div className='text-frame'>Deuda actual</div>
        <div className='text-[30px]'>
          {delegation.total_debt}
          <span className='text-[15px]'>USD</span>
        </div>
      </div>
      <div className='self-center'>
        <CustomButton type={`${delegation.total_debt > 0 ? 'outline' : 'disabled'}`} onClick={() => setDelegation(delegation)}>
          Pagar
        </CustomButton>
      </div>
    </div>
  )
}
