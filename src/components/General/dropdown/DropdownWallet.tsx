import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import React, { useState } from 'react'
import downArrow from '@/assets/icon/downArrow.svg';
import upArrow from '@/assets/icon/upArrow.svg';
import { MARKET_IMAGE } from '@/constants';

export default function DropdownWallet() {
  const [showMarket, setShowMarket] = useState<boolean>(false);
  const totalInWalletInUSD:number = useAppSelector((state:RootState) => state.markets.totalInWalletInUSD);
  const markets = useAppSelector((state:RootState) => state.markets.markets);
  const userDetail = useAppSelector((state: RootState) => state.user.userDetail);
  return (
    <div className='flex justify-start items-start flex-col md:mt-12'>
      <div className='font-bold text-[25px] md:text-[30px] leading-none flex'>
        <div>{totalInWalletInUSD} USD</div>
        {
          userDetail?.isDelegator &&
          <button onClick={() => setShowMarket(!showMarket)}>
            <img className='ml-2' src={showMarket ? upArrow.src : downArrow.src } alt="" />
          </button>
        }
      </div>
      <div className={`transition-opacity duration-500 transform ${showMarket ? 'opacity-100' : 'opacity-0'} md:pb-2`}>
        { showMarket &&
          markets.map((market) => (
            <div key={market.symbol} className='flex'>
              <img src={MARKET_IMAGE[market.symbol]?.src} alt={market.symbol} />
              <div className='mx-1'>
                { market.balanceInWallet }
                <span className='text-[12px] ml-1'>{ market.symbol }</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
