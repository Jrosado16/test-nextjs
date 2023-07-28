import React, { Suspense } from 'react'
import BaseDialog from './BaseDialog'
import CircleLoader from '../chart/CircleLoader'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../redux/hooks';
import { setTxDialog } from '../../redux/slices/actionSlice';
import { ITransaction } from '../../interfaces/actions.interface';
import Success from '../../assets/icon/success.svg'
import ErrorImage from '../../assets/icon/error.svg'
import CustomButton from '../General/buttons/CustomButton';
import { RootState } from '../../redux/store';

export default function TxDialog() {
  const isOpenDialogTx: boolean = useSelector((state:RootState) => state.action.isOpenDialogTx);
  const transaccion:ITransaction = useSelector((state:RootState) => state.action.transaction);
  const dispatch = useAppDispatch()

  if (!isOpenDialogTx) return null;

  const { text, subtext, component } = messages[transaccion.step] || {};

  return (
    <BaseDialog isOpen={isOpenDialogTx} onClose={() => dispatch(setTxDialog(false))}
      className={'background-tx w-[313px] h-[370px] md:w-[423px] md:h-[500px] flex flex-col justify-center'}
      backgroundImage='/assets/background.svg'
    >
      <div className='h-full flex flex-col items-center justify-center'>
        {
          transaccion.error &&
          <div>
            <div className='text-[16px] font-semibold text-text text-center flex flex-col content-center items-center md:text-[20px] md:font-bold'>
              <div className='mb-10'>
                <img src={ErrorImage.src} alt='Success' className='w-[56px] md:w-[100px]'/>
              </div>
              <div>Ocurrio un error</div>
            </div>
          </div>
        }
        {(transaccion.step === 1 || transaccion.step === 2) && <div className='mb-10 flex justify-center'><CircleLoader /></div>}
        <div className='flex flex-col content-center items-center'>
          {text && <Message>{text}</Message>}
          {subtext && <div className='text-[16px] w-[200px] text-text text-center leading-none'>{subtext}</div>}
          {component && component(transaccion)}
        </div>
        <div className='w-full flex justify-center'>
          {
            transaccion.step === 3 || transaccion.error &&
            <CustomButton onClick={() => dispatch(setTxDialog(false))} type='outline' className='mt-16 m-auto'>
              <span className='md:text-[16px]'>Continuar</span>
            </CustomButton>
          }
        </div>
      </div>
    </BaseDialog>
  )
}

const Message = ({children}: { children : React.ReactNode}) => (
  <div className='text-[20px] text-text font-semibold w-[260px] text-center leading-none mb-12'>
    {children}
  </div>
)

const messages:any = {
  1: { text: "Esperando la confirmación de la billetera", subtext: "Firma la transacción dando click en tu billetera." },
  2: { text: "Esperando la confirmación de la red" },
  3: {
    component: (transaction:ITransaction) => (
      <div className='text-[16px] font-semibold text-text text-center flex flex-col content-center items-center md:text-[20px] md:font-bold'>
        <div className='mb-10'>
          <img src={Success.src} alt='Success' className='w-[56px] md:w-[100px]'/>
        </div>
        {({
          deposit: 'Has depositado',
          repay: 'Has pagado',
          borrow: 'Has pedido prestado',
          withdraw: 'Has retirado',
          delegation: 'Has delegado',
          repay_debt_delegation: 'Has pagado'
        })[transaction.type]}
        <br />
        {transaction.amount} {transaction.token}
      </div>
    )
  },
}