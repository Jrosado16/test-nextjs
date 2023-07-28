import { waitForTransaction, writeContract, getAccount, getNetwork, readContract } from '@wagmi/core';
import IERC20 from '../artifacts/IERC20.json';
import ILENDINGPOOL from '../artifacts/ILendingPool.json';
import { parseUnits } from 'viem'
import { contracts } from '../constants';
import { IMarketInstance } from '../interfaces/markets.interface';
import ICreditDelegationToken from '../artifacts/ICreditDelegationToken.json';

export default class Market implements IMarketInstance {
  lendingPoolAddress:any = '';
  marketAddress:any = '';
  usdcVariableToken:any = '';
  constructor(address: string) {
    const { chain } = getNetwork();
    this.lendingPoolAddress = contracts[chain?.id || 0].LENDING_POOL as '`0x${string}`';
    this.marketAddress = address;
    this.usdcVariableToken = contracts[chain?.id || 0].USDC_VARIABLE_DEBT_TOKEN as '`0x${string}`'
  }
  
  async deposit(amount:number) {
    try {
      const decimal = await this.getDecimalToken(this.marketAddress);
      const approve = await writeContract({
        address: this.marketAddress,
        abi: IERC20.abi,
        functionName: 'approve',
        args: [
          this.lendingPoolAddress,
          parseUnits(`${amount}`, decimal)
        ]
      });
      await waitForTransaction({
        hash: approve.hash,
      });
      const tx = await writeContract({
        address: this.lendingPoolAddress,
        abi: ILENDINGPOOL.abi,
        functionName: 'deposit',
        args: [
          this.marketAddress,
          parseUnits(`${amount}`, 6),
          getAccount().address,
          0
        ]
      });
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async withdraw(amount:number) {
    try {
      const decimal = await this.getDecimalToken(this.marketAddress);
      const tx = await writeContract({
        address: this.lendingPoolAddress,
        abi: ILENDINGPOOL.abi,
        functionName: 'withdraw',
        args: [
          this.marketAddress,
          parseUnits(`${amount}`, decimal),
          getAccount().address,
        ]
      });
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async borrow(amount:number, walletAddress:string) {
    try {
      const decimal = await this.getDecimalToken(this.marketAddress);
      const interestRateMode = 2;
      const referralCode = 0;
      const tx = await writeContract({
        address: this.lendingPoolAddress,
        abi: ILENDINGPOOL.abi,
        functionName: 'borrow',
        args: [
          this.marketAddress,
          parseUnits(`${amount}`, decimal),
          interestRateMode,
          referralCode,
          walletAddress,
        ]
      });
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async repay(amount:number, walletAddress:string) {
    try {
      const interestRateMode = 2;
      const decimal = await this.getDecimalToken(this.marketAddress);
      const approve = await writeContract({
        address: this.marketAddress,
        abi: IERC20.abi,
        functionName: 'approve',
        args: [
          this.lendingPoolAddress,
          parseUnits(`${amount}`, decimal)
        ]
      });
      await waitForTransaction({
        hash: approve.hash,
      });
      const tx = await writeContract({
        address: this.lendingPoolAddress,
        abi: ILENDINGPOOL.abi,
        functionName: 'repay',
        args: [
          this.marketAddress,
          parseUnits(`${amount}`, 6),
          interestRateMode,
          walletAddress,
        ]
      });
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async approveDelegation(amount:number, borrowerAddress:string) {
    console.log('borrowerAddress: ', borrowerAddress);
    try {
      const decimal = await this.getDecimalToken(this.marketAddress);
  
      const tx = await writeContract({
        address: this.usdcVariableToken,
        abi: ICreditDelegationToken.abi,
        functionName: 'approveDelegation',
        args: [
          borrowerAddress.toLowerCase(),
          parseUnits(`${amount}`, decimal)
        ]
      });
  
      return tx;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

   async getDecimalToken (tokenAdrress:any): Promise<number> {
    const dataArray = await readContract({
      address: tokenAdrress,
      abi: IERC20.abi,
      functionName: 'decimals',
    });
    return Number(dataArray);
  }
}