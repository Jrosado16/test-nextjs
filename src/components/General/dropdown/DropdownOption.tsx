import React, { MouseEventHandler } from 'react'
import { IMarketDataProvider } from '../../../interfaces/markets.interface'
import { MARKET_IMAGE } from '@/constants'

type props = {
  onClick: MouseEventHandler,
  market: IMarketDataProvider,
}

export default function DropdownOption({ onClick, market }: props) {
  return (
    <button onClick={onClick} key={market.symbol}>
      <div className="h-[32px] md:h-[44px] flex content-center min-w-[100px] relative" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <div className="flex px-4 content-center items-center text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
          <img src={MARKET_IMAGE[market.symbol]?.src} alt='market' />
          <div className='text-text text-[15px] md:text-[18px] ml-2'>{market.symbol}</div>
        </div>
      </div>
    </button>
  )
}
