import React from 'react'
import BaseDialog from './BaseDialog'
import dollarIcon from '@/assets/icon/dollar.svg'
import CustomButton from '@/components/General/buttons/CustomButton'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { setDelegationDialog } from '@/redux/slices/userSlice'
import { IDelegations } from '@/interfaces/user.interface'

export default function DelegationDialog() {
  const showDialog:boolean = useAppSelector((state:RootState) => state.user.showDelegationDialog);
  const currentDelegation = useAppSelector((state:RootState) => state.user.currentDelegation) as IDelegations;
  const dispatch = useAppDispatch();

  return (
    <BaseDialog isOpen={showDialog} onClose={() => dispatch(setDelegationDialog(false))} className={`!w-[313px] !h-[370px]`}
      backgroundImage='/assets/background.svg'
    >
      <div className='flex justify-between flex-col items-center h-full py-10'>
        <img src={dollarIcon.src} alt='dollar' />
        <div className='text-text text-[14px] md:text-[18px] font-medium leading-none text-center w-[194px]'>
          Tienes una línea de crédito abierta de { currentDelegation.amount - currentDelegation.total_borrow } USD
        </div>
        <CustomButton onClick={() => dispatch(setDelegationDialog(false))} type='outline'>
          Continuar
        </CustomButton>
      </div>
    </BaseDialog>
  )
}
