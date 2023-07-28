import React, { MouseEventHandler } from 'react'
import CustomDropdown from '../../General/dropdown/CustomDropdown';
import { IDelegateesWithDelegations, IOneDelegatees } from '../../../interfaces/user.interface';

type Props = {
  delegations: IDelegateesWithDelegations,
  handleDelegatee: any
  delegatee: IOneDelegatees
}

export default function DropdownDelegator({ delegations, handleDelegatee, delegatee }: Props) {
  return (
    <CustomDropdown
      className='!w-full !h-[60px] bg-fields rounded-[5px]'
      rounded={5}
      defaultData={
        <div className=''>
          { delegatee?.email }
        </div>
    }>
      {
        delegations.delegatees?.map((delegatee, index) => {
          const hasActiveDelegation = delegatee.delegations.some((delegation) => delegation.is_active);
          return <div key={index} className=''>
            <button onClick={() => !hasActiveDelegation ? handleDelegatee(delegatee) : {}}
              className={`h-[40px] w-full pl-4 text-left ${hasActiveDelegation ? 'bg-disabled hover:bg-disabled cursor-not-allowed' : 'hover:bg-hover'}`}
            >
              { delegatee.email }
            </button>
          </div>
        })
      }
    </CustomDropdown>
  )
}
