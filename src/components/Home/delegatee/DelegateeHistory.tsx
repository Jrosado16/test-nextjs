'use client'
import { useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import React from 'react'

export default function DelegateeHistory() {
  const borrowingsHistory = useAppSelector((state:RootState) => state.user.borrowingsHistory);
  const userDetail = useAppSelector((state:RootState) => state.user.userDetail);
  if (userDetail?.isDelegator) return null;
  return (
    <section className='m-auto w-[290px] mt-16 md:w-[1081px]'>
      <h2 className='text-text text-[16] md:text-[20px] font-bold mb-3'>Historial</h2>
      <div className='h-[186px] rounded-[20px] m-auto pl-8 pr-6 md:pr-9 pt-5 md:pt-0 border border-frame md:flex md:h-min-[130px] md:justify-between md:items-center'>
        <div className='flex-1 justify-between text-text'>
          {
            borrowingsHistory.length === 0 &&
            <div className='text-center text-frame'>Aún no tienes movimientos </div>
          }
          {
            borrowingsHistory.map((borrow, index) => {
              const starDate = new Date(borrow.start_date?._seconds * 1000);
              const endDate = new Date(borrow.end_date?._seconds * 1000);
              return <div className='flex flex-1 mt-5 mb-3' key={index}>
                <div className='w-1/3'>
                  <div className='text-frame'>Fechas</div>
                  <div className='text-[16px]'>
                    { `${starDate.getDate()}/${starDate.getMonth() +  1}/${starDate.getFullYear()}` }
                  </div>
                  <div className='text-[16px]'>
                  { `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}` }
                  </div>
                </div>
                <div className='w-1/3'>
                  <div className='text-frame'>Cantidad</div>
                  <div className='text-[16px] md:text-[30px]'>{borrow.amount} <span className='text-[15px]'>USD</span></div>
                </div>
                <div className='w-1/3'>
                  <div className='text-frame'>Intereses pagados</div>
                  <div className='text-[16px] md:text-[30px]'>{borrow.paid_interest} <span className='text-[15px]'>USD</span></div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </section>
  )
}
