import React from 'react'
import CustomDropdown from '@/components/General/dropdown/CustomDropdown'
import { ACTION } from '@/constants'
import { IActionType } from '@/interfaces/actions.interface'

type Props = {
  handleSetCurrectAction: any
  currentAction: IActionType
}

export default function DropdownAction({ handleSetCurrectAction, currentAction } : Props) {
  return (
    <CustomDropdown
      className='border border-fields'
      defaultData={
        <div className='flex text-text content-center items-center text-center'>
          <span>
            {
              currentAction === ACTION.DELEGATION && 'Delegación'
            }
            {
              currentAction === ACTION.BORROW && 'Préstamos'
            }
          </span>
        </div>
    }>
      <button onClick={() => handleSetCurrectAction(ACTION.DELEGATION)} className='h-[32px] md:h-[44px] w-full flex items-center justify-center min-w-[100px]'>Delegación</button>
      <button onClick={() => handleSetCurrectAction(ACTION.BORROW)} className='h-[32px] md:h-[44px] w-full flex items-center justify-center min-w-[100px]'>Préstamo</button>
    </CustomDropdown>
  )
}
