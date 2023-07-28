import React, { MouseEventHandler, useState } from 'react'
import CircleChart from '../chart/CircleChart';
import BaseDialog from './BaseDialog';

type props = {
  isOpen: boolean,
  onClick: MouseEventHandler,
}

export default function HealthFactorDialog({ isOpen, onClick }: props) {
  
  return (
    <BaseDialog isOpen={isOpen} onClose={onClick}>
      <div className='text-text w-[313px]'>
        <div className='text-[15px] font-bold'>¿Qué es el factor de salud?</div>
        <p className='text-[13px] mt-3 mb-6'>El factor de salud define el porcentaje de tus depósitos que están comprometidos en tu tus préstamos. Cuanto mejor factor de salud, menor riesgo de liquidación.</p>
        <div className='text-[15px] font-bold'>Tu factor de salud actual</div>
        <div className='flex content-center items-center'>
          <div>
            <CircleChart />
            <div className='text-[12px] text-center'>Riesgo bajo</div>
          </div>
          <div className='text-[13px] mb-4'>0.3 de tus depósitos está comprometido en deudas.</div>
        </div>
        <hr className='bg-line mt-5' />
        <p className='text-[13px] mt-3'>Tu garantía no fluctúa en valor. Solo podrás ser liquidado por la acumulación de intereses de tu deuda.</p>
      </div>
    </BaseDialog>
  );
}
