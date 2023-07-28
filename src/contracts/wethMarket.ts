import { waitForTransaction, writeContract, getAccount, getNetwork, readContract } from '@wagmi/core';
import IWETHGateway from '../artifacts/IWETHGateway.json';
import IVaribaleToken from '../artifacts/VariableDebtToken.json'
import IDataProvider from '../artifacts/AaveProtocolDataProvider.json'

import IATokenABI from '../artifacts/IAToken.json';
import { parseUnits } from 'viem'
import { contracts } from '../constants';
import Market from './Market';

export default class WETHMarket extends Market {
  marketAddress:any = '';
  lendingPoolAddress:any = '';
  WETHGatewayAddress:any = '';
  aWETHAddress:any = '';
  providerAddress:any = '';
  constructor(address: string) {
    super(address);
    const { chain } = getNetwork();
    this.lendingPoolAddress = contracts[chain?.id || 0].LENDING_POOL as '`0x${string}`';
    this.WETHGatewayAddress = contracts[chain?.id || 0].WETHGateway as '`0x${string}`';
    this.aWETHAddress = contracts[chain?.id || 0].ATOKENS?.WETH as '`0x${string}`';
    this.providerAddress = contracts[chain?.id || 0].PROTOCOL_DATA_PROVIDER as '`0x${string}`';
    this.marketAddress = address;
  }
  
  async deposit(amount:number) {
    try {
      const decimals = await this.getDecimalToken(this.marketAddress);
      const tx = await writeContract({
        address: this.WETHGatewayAddress,
        abi: IWETHGateway.abi,
        functionName: 'depositETH',
        args: [
          this.lendingPoolAddress,
          getAccount().address,
          0,
        ],
        value: parseUnits(`${amount}`, decimals),
      });
  
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async withdraw(amount:number) {
    try {
      const decimals = await this.getDecimalToken(this.marketAddress);
      const approve = await writeContract({
        address: this.aWETHAddress,
        abi: IATokenABI.abi,
        functionName: 'approve',
        args: [
          this.WETHGatewayAddress,
          parseUnits(`${amount}`, decimals),
        ],
      });
      await waitForTransaction({
        hash: approve.hash,
      });
      const tx = await writeContract({
        address: this.WETHGatewayAddress,
        abi: IWETHGateway.abi,
        functionName: 'withdrawETH',
        args: [
          this.lendingPoolAddress,
          parseUnits(`${amount}`, decimals),
          getAccount().address,
        ],
      });
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async borrow(amount:number) {
    try {
      const tokens:any = await this.getReserveTokensAddresses();
      const decimals = await this.getDecimalToken(this.marketAddress);
      const variableDebtTokenAddress = tokens[2];
      const approve = await writeContract({
        address: variableDebtTokenAddress,
        abi: IVaribaleToken.abi,
        functionName: 'approveDelegation',
        args: [
          this.WETHGatewayAddress,
          parseUnits(`${amount}`, decimals),
        ],
      });
      await waitForTransaction({
        hash: approve.hash,
      });
      const tx = await writeContract({
        address: this.WETHGatewayAddress,
        abi: IWETHGateway.abi,
        functionName: 'borrowETH',
        args: [
          this.lendingPoolAddress,
          parseUnits(`${amount}`, decimals),
          2, // variable
          0,
        ],
      });
  
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async repay(amount:number) {
    try {
      const decimals = await this.getDecimalToken(this.marketAddress);
      const tx = await writeContract({
        address: this.WETHGatewayAddress,
        abi: IWETHGateway.abi,
        functionName: 'repayETH',
        args: [
          this.lendingPoolAddress,
          parseUnits(`${amount}`, decimals),
          2,
          getAccount().address,
        ],
        value: parseUnits(`${amount}`, decimals),
      });
  
      return tx;
    } catch (error) {
      console.log('error: ', error);
      throw new Error(`${error}`);
    }
  }

  async getReserveTokensAddresses() {
    const tokens = await readContract({
      address: this.providerAddress,
      abi: IDataProvider.abi,
      functionName: 'getReserveTokensAddresses',
      args: [
        this.marketAddress
      ]
    });
    console.log('tokens: ', tokens);
    return tokens;
  }
}