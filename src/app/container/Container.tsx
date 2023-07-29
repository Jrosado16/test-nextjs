'use client'
import Navbar from '@/components/Navbar/Navbar';
import { useMarketReserve } from '@/hooks/useMarketReserve';
import React, { useEffect } from 'react'
import { watchAccount, getAccount, watchNetwork } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import { fetchMarkets } from '@/redux/slices/marketSlice';
import { fetchUserDetail } from '@/redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import TxDialog from '@/components/dialog/TxDialog';
import DelegationDialog from '@/components/dialog/DelegationDialog';
import { RootState } from '@/redux/store';

export default function Container({ children }: { children: React.ReactNode }) {
  const { loading, error, data } = useMarketReserve();
  const account = getAccount();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingAction = useAppSelector((state:RootState) => state.action.loadingAction);

  useEffect(() => {
    watchNetwork((network) => {
      console.log('network: network', network);
    });
  
    watchAccount((account) => {
      console.log('account: ', account);
      if (!account.address) {
        router.push('/login');
        return
      }
      if (!loading && !error && !loadingAction) {
        console.log('account: con address', account?.address);
        dispatch(fetchUserDetail());
        dispatch(fetchMarkets(data));
      }
    });
    console.log('loading, error, data, loadingAction: ', loading, error, data, loadingAction);
    if (!account.address) {
      router.push('/login');
      return;
    }
    if (!loading && !error && !loadingAction) {
      dispatch(fetchMarkets(data));
    }
    if (account.address && !loading && !error && !loadingAction) {
      dispatch(fetchUserDetail());
    }
  }, [loading, error, data, loadingAction])
  return (
    <div>
      <Navbar />
      { children }
      <TxDialog />
      <DelegationDialog />
    </div>
  )
}
