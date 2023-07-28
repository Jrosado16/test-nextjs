'use client'
import React, { useEffect, useState } from 'react'
import CustomButton from '@/components/General/buttons/CustomButton'
import CustomDropdown from '@/components/General/dropdown/CustomDropdown'
import Link from 'next/link';
import { IMarketDataProvider } from '@/interfaces/markets.interface';
import DropdownOption from '@/components/General/dropdown/DropdownOption';
import { ACTION, MARKET_IMAGE } from '@/constants';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';
import { IDelegations, IUserTypeDetail } from '@/interfaces/user.interface';
import { useRouter } from 'next/navigation';
import { reduceDecimals } from '@/utils/reduceDecimals';

export default function BorrowContent() {
  const markets:IMarketDataProvider[] = useAppSelector((state:RootState) => state.markets.markets);
  const loading = useAppSelector((state:RootState) => state.markets.loading);
  const router = useRouter();
  const actual = useAppSelector((state:RootState) => state.markets.currentMarket) as IMarketDataProvider;
  const currentDelegation = useAppSelector((state:RootState) => state.user.currentDelegation) as IDelegations;
  const userDetail = useAppSelector((state:RootState) => state.user.userDetail) as IUserTypeDetail;
  const [currentMarket, setCurrentMarket] = useState<IMarketDataProvider>(actual);
  useEffect(() => {
    setCurrentMarket(actual);
  }, [actual])
  
  const handleMarket = (market:IMarketDataProvider) => {
    setCurrentMarket(market)
  }
  return (
    <section className='m-auto w-[290px] mt-16 md:w-[1081px]'>
      <h2 className='text-text text-[16] md:text-[20px] font-bold mb-3'>Tus préstamos</h2>
      <div className='h-[186px] rounded-[20px] m-auto pl-8 pr-6 md:pr-9 pt-5 md:pt-0 border border-frame md:flex md:h-[130px] md:justify-between md:items-center'>
        <div className="flex justify-between md:flex-col md:justify-center md:content-center">
        <CustomDropdown
          className={`${userDetail?.isDelegator && 'border border-fields'}`}
          defaultData={
          <div className='flex text-text content-center items-center'>
            <div className='font-bold leading-none'>
              <img src={MARKET_IMAGE[currentMarket?.symbol]?.src} alt='market' />
            </div>
            <div className='text-text text-[15px] md:text-[18px] ml-2'>{ currentMarket?.symbol }</div>
          </div>
          }
          >
            <>
            {
              markets.length > 0 && markets?.map((market:IMarketDataProvider) => (
                <DropdownOption onClick={() => handleMarket(market)} market={market} key={market.symbol} />
              ))
            }
            </>
          </CustomDropdown>
          <div className='flex md:self-center md:mt-2'>
            <div>{ currentMarket?.variableBorrowRate || 0 }%</div>
            <div>anual</div>
          </div>            
        </div>
        <div className='flex justify-between'>
          <div className='mt-4 md:mr-16'>
            <div className='text-frame text-[12px] md:text-[18px]'>Deuda</div>
            <div className='flex text-text mt-2 mb-6'>
              <div className='text-[20px] md:text-[30px] self-end leading-none'>
                {
                  userDetail?.isDelegator ? reduceDecimals(currentMarket?.currentVariableDebt || 0)
                  : currentDelegation.total_debt || 0
                }
              </div>
              <div className='text-[12px] md:text-[15px] self-end'>USD</div>
            </div>
          </div>
          <div className='mt-4 text-center w-[109px] md:w-full md:text-left'>
            <div className='text-frame text-[12px] md:text-[18px]'>Intereses</div>
            <div className='flex text-text mt-2 mb-6 justify-center'>
              <div className='text-[20px] md:text-[30px] self-end leading-none'>
                {
                  userDetail?.isDelegator ? 0
                  : (currentDelegation?.total_debt - currentDelegation?.total_principal) || 0
                }
              </div>
              <div className='text-[12px] md:text-[15px] self-end'>USD</div>
            </div>
          </div>
        </div>
        <div className='flex justify-between'>
          {
            userDetail?.isDelegator ?
            <Link href={`/actions/${currentMarket?.tokenAddress}?name=${ACTION.BORROW}`}>
              <CustomButton type='outline' onClick={() => {}} className='md:mr-9'>
                Pedir prestado
              </CustomButton>
            </Link>
            : 
            <CustomButton
              className='md:mr-9'
              type={`${currentDelegation.amount > 0 ? 'outline' : 'disabled'}`}
              onClick={() => {
                currentDelegation.amount > 0 && router.push(`/actions/${currentMarket?.tokenAddress}?name=${ACTION.BORROW}`)
              }}
            >
              Pedir prestado
            </CustomButton>
          }
          {
            userDetail?.isDelegator ?
            <Link href={`/actions/${currentMarket?.tokenAddress}?name=${ACTION.REPAY}`}>
              <CustomButton
                type={`${currentMarket?.currentVariableDebt > 0 ? 'primary' : 'disabled'}`}
                onClick={() => {}}
              >
                Pagar
              </CustomButton>
            </Link>
            :
            <CustomButton
              type={`${currentDelegation?.total_debt > 0 ? 'primary' : 'disabled'}`}
              onClick={() => {
                currentDelegation.total_borrow > 0 && router.push(`/actions/${currentMarket?.tokenAddress}?name=${ACTION.REPAY}`)
              }}
            >
              Pagar
            </CustomButton>
          }
        </div>
      </div>
    </section>
  )
}
