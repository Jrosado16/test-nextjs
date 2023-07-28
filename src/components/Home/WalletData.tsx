'use client'
import React from 'react'
import CustomButton from '@/components/General/buttons/CustomButton';
import DropdownWallet from '../General/dropdown/DropdownWallet';

export default function WalletData() {
  return (
    <section className='m-auto w-[290px] mt-14 md:w-[1081px] md:mt-24'>
      <h2 className='text-text text-[16] md:text-[20px] font-bold mb-3'>Tu billetera</h2>
      <div className='bg-fields min-h-[130px] rounded-[20px] m-auto pl-8 pt-5 md:flex md:justify-between md:px-9 md:content-center md:pt-0'>
        <DropdownWallet />
        <div className='flex flex-wrap gap-3 md:gap-9 mt-3 self-center md:mt-0 pb-3 md:pb-0'>
          <CustomButton type='secondary' onClick={() =>{}}>Comprar monedas </CustomButton>
          <CustomButton type='secondary' onClick={() =>{}}>Enviar monedas</CustomButton>
          <CustomButton type='secondary' onClick={() =>{}}>Retirar a tu banco</CustomButton>
        </div>
      </div>
    </section>
  )
}
