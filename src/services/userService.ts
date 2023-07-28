import { httpsCallable } from '@firebase/functions';
import { getAccount, getNetwork } from '@wagmi/core';
import { IDelegateesWithDelegations, IDelegations, IUserDetail, IUserTypeDetail } from '../interfaces/user.interface';
import { functions } from '../config/firebase.config';
import { contracts } from '../constants';
const getUserDetailByWalletFt = httpsCallable(functions, 'getUserDetailByWallet');
const getAllDelegateesFt = httpsCallable(functions, 'getAllDelegatees');
const getUserDetailByEmail = httpsCallable(functions, 'getUserDetailByEmail');
const createDelegator = httpsCallable(functions, 'createDelegator');
const getCurrentDelegationDetail = httpsCallable(functions, 'getCurrentDelegationDetail');
const getPaidBorrowings = httpsCallable(functions, 'getPaidBorrowings');
const findDelegateeFt = httpsCallable(functions, 'findDelegatee');
const createDelegateeFn = httpsCallable(functions, 'createDelegatee');
const deposit = httpsCallable(functions, 'deposit');
const setTransactions = httpsCallable(functions, 'setTransactions');
const delegation = httpsCallable(functions, 'delegation');
const getDelegationsInfo = httpsCallable(functions, 'getDelegationsInfo');

export const getUserDetailByWallet = async (): Promise<IUserTypeDetail> => {
  try {
    const { chain } = getNetwork();
    const response = await getUserDetailByWalletFt({ findByData: getAccount().address?.toLowerCase(), chainId: chain?.id });
    const result:IUserDetail = response.data as IUserDetail;
    return result.userDetail;
  } catch (error) {
    console.log('error: ', error);
    throw new Error('Error');
  }
}

export const getAllDelegatees = async (company_id: string): Promise<IDelegateesWithDelegations> => {
  const { chain } = getNetwork();

  const response = await getAllDelegateesFt({
    company_id: company_id,
    chainId: chain?.id,
  });
  const result = response.data as IDelegateesWithDelegations
  return result;
}

export const findUser = async (nickname: string) => {
  const { chain } = getNetwork();
  const { data } = await getUserDetailByEmail({ findByData: nickname, chainId: chain?.id });
  return data;
}

export const createUser = async (data:any) => {
  try {
    const { email, address, company_id, chainId, user_type } = data;
    if (user_type === 'delegator') {
      const response:any = await createDelegator({
        email, address, company_id: email, chainId
      });
      return response.data.created as boolean;
    } else {
      const info = {
        company_id, email, name: email, chainId, delegatee_id: address
      };
      const response:any = await createDelegateeFn(info);
      return response.data.created as boolean;
    }
  } catch (error) {
    return false;
  }
}

export const getDelegationActive = async () => {
  const { chain } = getNetwork();
  const response = await getDelegationsInfo({
    delegatee: getAccount().address?.toLowerCase(),
    chainId: chain?.id,
  });

  const delegations:IDelegations[] = response.data as IDelegations[];

  const delegation = delegations.find((delegation: IDelegations) => {
    return delegation.is_active ? delegation : null
  });

  return delegation;
}

export const getCurrentDelegation = async (delegatee_id: string, delegatorTotalDebt:number):Promise<IDelegations> => {
  const { chain } = getNetwork();
  const response = await getCurrentDelegationDetail({
    delegatee_id: delegatee_id,
    delagator_debt_onchain: delegatorTotalDebt,
    chainId: chain?.id,
  });

  const data:any = response.data;
  return data?.delegation as IDelegations;
}

export const getBorrowingsHistory = async ():Promise<IDelegations[]> => {
  const { chain } = getNetwork();
  const params = {
    delegatee_id: getAccount().address?.toLowerCase(),
    chainId: chain?.id,
  };
  const { data } = await getPaidBorrowings(params);
  const response:any = data;
  return response.delegations;
};

export const findDelegatee = async (email: string) => {
  const { chain } = getNetwork();
  const { data } = await findDelegateeFt({ email: email, chainId: chain?.id });
  return data;
}

export const createDelegatee = async (company_id:string, email:string) => {
  const { chain } = getNetwork();
  const params = {
    company_id,
    email,
    chainId: chain?.id
  }
  const { data } = await createDelegateeFn(params);
  return data;
}

export const setActionFunctionDeposit = async (tx:any, amount:number) => {
  const { chain } = getNetwork();
  const params = {
    deposit: amount,
    transaction_type: 'Deposit',
    delegator_id: getAccount().address?.toLowerCase(),
  };
  const response = await deposit({ tx, params, chainId: chain?.id });
  return response;
}

export const setActionFunctionBorrow = async (tx:any, amount:number, currentDebtDelegator:number, delegation:IDelegations) => {
  const { chain } = getNetwork();
  const params = {
    amount: amount,
    transaction_type: 'borrow',
    delagator_debt_onchain: currentDebtDelegator,
    delegation_id: delegation?.delegation_id,
  };
  const response = await setTransactions({
    tx,
    params,
    chainId: chain?.id,
  });
  return response;
}

export const setActionFunctionRepay = async (tx:any, amount:number, currentDebtDelegator:number, delegation:IDelegations) => {
  const { chain } = getNetwork();
  const params = {
    amount: amount,
    transaction_type: 'reapy',
    delagator_debt_onchain: currentDebtDelegator,
    delegation_id: delegation?.delegation_id,
  };
  const response = await setTransactions({
    tx,
    params,
    chainId: chain?.id,
  });
  return response;
}

export const setActionFunctionDelegation = async (tx:any, amount:number, borrowerAddress:string) => {
  const { chain } = getNetwork();
  const params = {
    amount,
    delegator_id: getAccount().address?.toLowerCase(),
    delegatee_id: borrowerAddress,
    asset_id: contracts[chain?.id || 0].TOKENS?.USDC,
    type: 'variable',
  };
  const response = await delegation({ tx, chainId: chain?.id, params });
  return response;
}