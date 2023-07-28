'use client'
import React, { useEffect, useState } from 'react'
import CustomButton from '@/components/General/buttons/CustomButton'
import CustomDropdown from '@/components/General/dropdown/CustomDropdown'
import Link from 'next/link';
import { RootState } from '@/redux/store';
import { IMarketDataProvider } from '@/interfaces/markets.interface';
import { useAppSelector } from '@/redux/hooks';
import DropdownOption from '@/components/General/dropdown/DropdownOption';
import safeIcon from '@/assets/icon/safe.svg';
import { ACTION, MARKET_IMAGE } from '@/constants';
import { IUserTypeDetail } from '@/interfaces/user.interface';

export default function SavingContent() {
  const markets:IMarketDataProvider[] = useAppSelector((state:RootState) => state.markets.markets);
  const userDetail = useAppSelector((state:RootState) => state.user.userDetail) as IUserTypeDetail;
  const loading = useAppSelector((state:RootState) => state.markets.loading);
  const actual = useAppSelector((state:any) => state.markets.currentMarket);
  const [currentMarket, setCurrentMarket] = useState<IMarketDataProvider>(actual);
  useEffect(() => {
    setCurrentMarket(actual);
  }, [actual])
  
  const handleMarket = (market:IMarketDataProvider) => {
    setCurrentMarket(market)
  }
  if (!userDetail?.isDelegator) return null;
  return (
    <section className='m-auto w-[290px] mt-16 md:w-[1081px]'>
      <div className='flex justify-between'>
        <h2 className='text-text text-[16] md:text-[20px] font-bold mb-3'>Tu cuenta de ahorro</h2>
        <div className='flex items-center'>
          <div className='mt-1'>
            <img src={safeIcon.src} alt="safe"/>
          </div>
          <div className='text-[18px] font-sans ml-3 mr-2 hidden md:inline-block'>
            Tus fondos están <span className='font-bold text-text'>asegurados</span>
          </div>
        </div>
      </div>
      <div className='h-[186px] rounded-[20px] m-auto pl-8 md:pr-9 pt-5 pr-6 md:pt-0 border border-frame md:flex md:h-[130px] md:justify-between md:items-center'>
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
            <div>{ currentMarket?.liquidityRate }%</div>
            <div>anual</div>
          </div>            
        </div>
        <div className='flex justify-between'>
          <div className='mt-4 md:mr-16'>
            <div className='text-frame text-[12px] md:text-[18px]'>Depositado</div>
            <div className='flex text-text mt-2 mb-6'>
              <div className='text-[20px] md:text-[30px] self-end leading-none'>{ currentMarket?.currentATokenBalance }</div>
              <div className='text-[12px] md:text-[15px] self-end'>USD</div>
            </div>
          </div>
          <div className='mt-4 text-center w-[109px] md:w-full md:text-left'>
            <div className='text-frame text-[12px] md:text-[18px]'>Interés</div>
            <div className='flex text-text mt-2 mb-6 justify-center'>
              <div className='text-[20px] md:text-[30px] self-end leading-none'>0</div>
              <div className='text-[12px] md:text-[15px] self-end'>USD</div>
            </div>
          </div>
        </div>
        <div className='flex justify-between'>
          <Link href={`/actions/${currentMarket?.tokenAddress}?name=${ACTION.DEPOSIT}`}>
            <CustomButton type='outline' onClick={() => {}} className='md:mr-9'>
              Depositar
            </CustomButton>
          </Link>
          <Link href={`/actions/${currentMarket?.tokenAddress}?name=${ACTION.WITHDRAW}`}>
            <CustomButton type={`${currentMarket?.currentATokenBalance > 0 ? 'primary' : 'disabled'}`} onClick={() => {}}>
              Retirar
            </CustomButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
