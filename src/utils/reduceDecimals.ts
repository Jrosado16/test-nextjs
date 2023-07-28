import { ZK_TOKENS } from "../constants";

export const reduceDecimals = (value: number, token:string = 'USDC', reduceNumber: number = 2) => {
  let decimals = reduceNumber;
  if (token === ZK_TOKENS.USDC) decimals = 2;
  if (token === ZK_TOKENS.WETH) decimals = 4;
  if (token === ZK_TOKENS.WBTC) decimals = 6;
  return Number(value?.toFixed(decimals));
}