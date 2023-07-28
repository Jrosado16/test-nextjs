'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { IDelegateesWithDelegations } from '../../../interfaces/user.interface'
import Delegation from './Delegation'
import CustomButton from '@/components/General/buttons/CustomButton'
import { useRouter } from 'next/navigation'
import { ACTION } from '@/constants'
import { useAppSelector } from '@/redux/hooks'

export default function Delegations() {
  const delegations = useSelector((state:RootState) => state.user.delegations) as IDelegateesWithDelegations
  const usdcMarket = useAppSelector((state:RootState) => state.markets.usdcMarket)
  const userDetail = useSelector((state:RootState) => state.user.userDetail)
  const existActiveDelegations = useSelector((state:RootState) => state.user.existActiveDelegations)
  const router = useRouter();

  if (!userDetail?.isDelegator) return
  return (
    <section className='m-auto w-[290px] mt-16 md:w-[1081px] mb-10'>
      <div className='flex justify-between'>
        <h2 className='text-text text-[16] md:text-[20px] font-bold mb-3'>
          Líneas de crédito delegadas
        </h2>
      </div>
      <div className='rounded-[20px] m-auto pl-8 md:pr-9 pt-5 pr-6 md:pt-0 border border-frame md:flex flex-col pb-10'>
        { 
          existActiveDelegations ?
            delegations.delegatees?.map((delegatee, index) => (
              delegatee.delegations?.map((delegation, i) => {
                { return delegation.is_active &&
                  <Delegation delegatee={delegatee} delegation={delegation} key={`${index}-${i}`} />
                  }
                }
              )
            ))
          : <div className='flex flex-1 items-center justify-between mt-10'>
              <div>No has delegado ningún depósito</div>
              <CustomButton type='primary' onClick={()  => {
                router.push(`/actions/${usdcMarket?.tokenAddress}?name=${ACTION.DELEGATION}`)
              }}>
                Delegar
              </CustomButton>
            </div>
        }
      </div>
    </section>
  )
}
