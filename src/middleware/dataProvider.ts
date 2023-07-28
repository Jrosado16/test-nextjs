import { readContract, getAccount, getNetwork, fetchBalance } from '@wagmi/core';
import DATA_PROVIDER_ABI from '../artifacts/AaveProtocolDataProvider.json';
import IERC20ABI from '../artifacts/IERC20.json';
import ILendingPool from '../artifacts/ILendingPool.json';
import IAaveOracle from '../artifacts/IAaveOracle.json';
import { contracts } from '../constants';
import { IMarketDataProvider } from '../interfaces/markets.interface';
import { reduceDecimals } from '../utils/reduceDecimals';
import { IUserAccountData } from '../interfaces/user.interface';

const defaultChainId:number = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAINID);

export const getUserReserveData = async () => {
  try {
    const { chain } = getNetwork();
    const tokens = contracts[chain?.id || defaultChainId].TOKENS || {};
    const dataArray:IMarketDataProvider[] = [];
    await Promise.all(Object.entries(tokens).map(async (token) => {
      const tokenAddress:any = token[1];
      const data = await getUserReserveFromToken(tokenAddress, token[0], getAccount().address as string)
      dataArray.push(data);
    }));
    return dataArray;
  } catch (error) {
    console.log('error: ', error);
  }
}

export const getUserReserveFromToken = async (tokenAddress:string, symbol:string, userAddress:string) => {
  const { chain } = getNetwork();
  const provider = contracts[chain?.id || defaultChainId].PROTOCOL_DATA_PROVIDER as `0x${string}`;
  const promiseContract = readContract({
    address: provider,
    abi: DATA_PROVIDER_ABI.abi,
    functionName: 'getUserReserveData',
    args: [
      tokenAddress,
      userAddress
    ],
  });
  const decimal = await getDecimalToken(tokenAddress);
  const balanceInWallet = await getWalletTokenBalance(userAddress, tokenAddress);
  const userData:IUserAccountData | undefined = await  getUserAccountData(userAddress as string);
  const price = await getTokenPrice(tokenAddress, decimal);
  const maxToBorrowInToken = (userData?.availableBorrowsUSD || 0) / (price || 0);
  const data = await promiseContract.then((result: any) => {
    return {
      tokenAddress,
      symbol,
      balanceInWallet: reduceDecimals(balanceInWallet, symbol),
      balanceInWalletInUSD: reduceDecimals(balanceInWallet * (price || 0), symbol),
      currentATokenBalance: formatDecimal(result[0], decimal, symbol),
      currentStableDebt: formatDecimal(result[1], decimal, symbol),
      currentVariableDebt: formatDecimal(result[2], decimal, symbol),
      principalStableDebt: formatDecimal(result[3], decimal, symbol),
      scaledVariableDebt: formatDecimal(result[4], decimal, symbol),
      stableBorrowRate: reduceDecimals((Number(result[5]) / 1e27) * 100),
      liquidityRate: reduceDecimals((Number(result[6]) / 1e27) * 100),
      stableRateLastUpdated: Number(result[6]),
      usageAsCollateralEnabled: result[8],
      maxToBorrowInUSD: userData?.availableBorrowsUSD,
      maxToBorrowInToken,
    } as IMarketDataProvider;
  });
  return data;
}

export const getUserAccountData = async (address:string): Promise<IUserAccountData | undefined> => {
  try {
    const { chain } = getNetwork();
    const provider = contracts[chain?.id || defaultChainId].LENDING_POOL as `0x${string}`;
    const decimals = contracts[chain?.id || defaultChainId].ORACLE_DECIMALS || 18;
    const response:any = await readContract({
      address: provider,
      abi: ILendingPool.abi,
      functionName: 'getUserAccountData',
      args: [
        address,
      ]
    });
    const userAccountData: IUserAccountData = {
      totalCollateralUSD: Number(response['0']) / 10 ** decimals,
      totalDebtUSD: Number(response['1']) / 10 ** decimals,
      availableBorrowsUSD: Number(response['2']) / 10 ** decimals,
      currentLiquidationThreshold: Number(response['3']),
      ltv: Number(response['4']),
      healthFactor: Number(response['5']) / 10 ** decimals,
    }
    return userAccountData;
  } catch (error) {
    console.log('error: ', error);
  }
}
const getDecimalToken = async (tokenAdrress:any): Promise<number> => {
  const dataArray = await readContract({
    address: tokenAdrress,
    abi: IERC20ABI.abi,
    functionName: 'decimals',
  });
  return Number(dataArray);
}

const formatDecimal = (value:any, decimal: number, token: string) => {
  return reduceDecimals(Number(value) / 10 ** decimal, token)
}

const getWalletTokenBalance = async (walletAddress:any, token:any) => {
  const { chain } = getNetwork();
  const WETH = contracts[chain?.id || 0].TOKENS?.WETH
  let params = {
    address: walletAddress,
    token,
  }
  if (WETH === token) delete params.token;
  const response = await fetchBalance(params);
  const value = Number(response.value) / 10 ** response.decimals;
  return value;
}

const getTokenPrice = async (tokenAddress: string, decimal:number) => {
  try {
    const { chain } = getNetwork();
    const lendingPoolAddressProvider = contracts[chain?.id || defaultChainId].AAVE_ORACLE as `0x${string}`;
    const price:any = await readContract({
      address: lendingPoolAddressProvider,
      abi: IAaveOracle.abi,
      functionName: 'getAssetPrice',
      args: [
        tokenAddress
      ]
    });
  
    const value = reduceDecimals(Number(price) / 1e18);
    return value || 0;
  } catch (error) {
    console.log('error: ', error);
  }
}