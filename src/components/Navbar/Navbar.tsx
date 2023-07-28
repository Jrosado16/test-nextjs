'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from '@/assets/tropy-logo.svg';
import menu from '@/assets/icon/menu.svg';
import closeSession from '@/assets/icon/closeSession.svg';
import usePath from './usePath';
import { usePathname } from 'next/navigation';
import CustomButton from '../General/buttons/CustomButton';
import copyIcon from '@/assets/icon/copy-clipboard.svg';
import gas from '@/assets/icon/gas.svg';
import gasRed from '@/assets/icon/gasRed.svg';

export default function Navbar() {
  const pathName = usePathname();
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text).then(function() {
      console.log('Copying to clipboard was successful!');
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }, function(err) {
      console.error('Could not copy text: ', err);
    });
  }
  
  if (pathName === '/register' || pathName === '/login') return null;
  return (
    <nav className='mt-5 flex justify-between mx-5'>
      <div className='hidden md:flex'>
        <img src={logo.src} alt='logo'/>
      </div>
      <div className='md:hidden flex'>
        <img src={menu.src} alt='logo'/>
      </div>
      <div className='text-[24px] font-bold mt-1 hidden md:flex'>
        <Link href={'/'}>
          <span className={`mr-10 currentPath' === '/' ? 'text-text' : 'text-disable'}`}>Inicio</span>
        </Link>
        <Link href={'/activity'}>
          <span className={'currentPath'}>Actividad</span>
        </Link>
      </div>
      <div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === 'authenticated');
            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button onClick={openConnectModal} type="button" className='btn-secondary btn w-[220px] h-[48px]'>
                        Connectar billetera
                      </button>
                    );
                  }
                  if (chain.unsupported) {
                    return (
                      <CustomButton type='outline' onClick={openChainModal}>
                        Cambiar red
                      </CustomButton>
                    );
                  }
                  return (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div className='flex items-center mr-5'>
                        <div>
                          <img src={ Number(account?.balanceFormatted) > 0 ? gas.src : gasRed.src} alt="" className='w-[20px] mr-5 md:w-[27px]' />
                        </div>
                        <div>
                          <div className='mr-4'>{account.displayName}</div>
                          <div className='text-frame leading-none'>
                            { chain.id === 1442 ?
                              <span>Testnet</span>
                              :
                              <span>Mainnet</span>
                            }
                          </div>

                        </div>
                        <div className='relative'>
                          <button onClick={() => copyToClipboard(account.address)}>
                            <img src={copyIcon.src} alt="" className='w-[18px]' />
                          </button>
                          {
                            copied && <div className='absolute text-text'>copied</div>
                          }
                        </div>
                      </div>
                      <CustomButton onClick={openAccountModal} type='outline' className='hidden md:flex items-center justify-center'>
                        Cerrar sesión
                      </CustomButton>
                      <button className='flex md:hidden items-center'>
                        <img src={closeSession.src} alt="" className='w-[18px]' />
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  )
}
