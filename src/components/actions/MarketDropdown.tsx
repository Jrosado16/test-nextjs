import { MARKET_IMAGE } from '@/constants';
import CustomDropdown from '../General/dropdown/CustomDropdown';
import DropdownOption from '../General/dropdown/DropdownOption';
import { IMarketDataProvider } from '@/interfaces/markets.interface';

type Props = {
  markets: IMarketDataProvider[],
  currentMarket: IMarketDataProvider,
  handleMarket: Function,
}

export const MarketDropdown = ({ markets, currentMarket, handleMarket }: Props) => (
  <CustomDropdown
    className='border border-fields'
    defaultData={
    <div className='flex text-text content-center items-center'>
      <div className='font-bold leading-none'>
        <img src={MARKET_IMAGE[currentMarket?.symbol]?.src} alt='market' />
      </div>
      <div className='text-text text-[15px] md:text-[18px] ml-2'>{ currentMarket?.symbol}</div>
    </div>
    }
  >
    <>
    {
      markets.length > 0 && markets.map((market:IMarketDataProvider) => (
        <DropdownOption onClick={() => handleMarket(market)} market={market} key={market.symbol} />
      ))
    }
    </>
  </CustomDropdown>
);
