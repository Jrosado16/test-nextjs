'use client'
import React, { useEffect, useState } from 'react'
import logo from '@/assets/tropy-alpha.svg';
import { useRouter } from 'next/navigation';
import { watchAccount } from '@wagmi/core';
import CustomConnectButton from '@/components/General/buttons/CustomConnectButton';
import { useAppDispatch } from '@/redux/hooks';
import { fetchUserDetail } from '@/redux/slices/userSlice';
import CircleLoader from '@/components/chart/CircleLoader';

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await dispatch(fetchUserDetail());
        console.log('data: ', data);
        if (!data.payload) return
        redirectUser(data.payload);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
  
    watchAccount((account) => {
      console.log('account.address: login', account.address);
      if (account.address) {
        fetchDetails();
      }
    });
  }, []);

  const redirectUser = (user:any) => {
    if (!user?.email) {
      router.push('/register');
    } else {
      router.push('/');
    }
  }

  return (
    <div className='background-login w-full h-screen bg-text flex items-center justify-center'
      style={{ backgroundImage: 'url(assets/topographic--dark.svg)'}}
    >
      <div className='bg-white w-[400px] h-full self-center md:ml-16 flex items-center justify-center flex-col'>
        <h2 className='text-text text-[20px] font-bold'>Iniciar Sesion</h2>
        <div className='mt-5'>
          {
            loading ? <CircleLoader /> : <CustomConnectButton />
          }
        </div>
      </div>
      <div className='flex-col content-center items-center flex-1 hidden md:inline-flex'>
        <img src={logo.src} alt='logo' className='w-[280px] mb-5' />
        <div className='text-white text-[28px] w-[425px] leading-9 text-center'>La plataforma con los mejores préstamos de confianza.</div>
      </div>
    </div>
  )
}

export default Login