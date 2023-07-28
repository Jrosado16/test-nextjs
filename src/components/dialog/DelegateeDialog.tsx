import React, { useState } from 'react'
import BaseDialog from './BaseDialog'
import CustomButton from '../General/buttons/CustomButton'
import { createDelegatee, findDelegatee } from '../../services/userService';
import Spinner from '../chart/Spiner';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import { fetchDelegatees } from '../../redux/slices/userSlice';
import { IUserTypeDetail } from '../../interfaces/user.interface';

export default function DelegateeDialog({ isOpen, onClose }: { isOpen: boolean, onClose: React.MouseEventHandler }) {
  const [nickname, setNickname] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [activeButton, setActiveButton] = useState<boolean>(false);
  const userDetail = useSelector((state:RootState) => state.user.userDetail);
  const dispatch = useAppDispatch();

  const resetData = () => {
    setStep(1);
    setNickname('');
  }

  const handleFindDelegatee = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 4) {
      const response:any = await findDelegatee(value);
      setNickname(value);
      const userValid = response.exist && response.user?.company_id === '';
      if (response.exist) {
        setAlertMessage(!userValid ? 'Usuario ya fue delegado' : '');
      } else {
        setAlertMessage(!userValid ? 'Usuario no registrado como delegado' : '');
      }
      setActiveButton(userValid);
    } else {
      setNickname(value);
      setAlertMessage(value.length === 0 ? '' : 'Debe tener al menos 4 caracteres');
      setActiveButton(false);
    }
  };
  const handleAddDelegate = async () => {
    try {
      if (!activeButton || loading) return;
      setLoading(true);
      setActiveButton(false);
      const response = await createDelegatee(userDetail?.company_id || '', nickname);
      console.log('response: ', response);
      dispatch(fetchDelegatees(userDetail as IUserTypeDetail));
      setLoading(false)
      setStep(2);
      setActiveButton(true);
    } catch (error) {
      setAlertMessage('Hubo un error intenta mas tarde'); 
    }
  }
  return (
    <BaseDialog isOpen={isOpen} onClose={(e) => { onClose(e); resetData()}}>
      <div className='flex flex-col items-center mt-2 text-text h-full'>
        {
          step === 1 ?
            <>
              <h2 className='font-bold text-[15px]'>Agrega un delegado</h2>
              <p className='text-[13px] w-[225px] mt-8 mb-8'>Ingresa una dirección de email valida y que ya esté registrada como delegado</p>
              <input type="text" placeholder='email, nickname' className='bg-fields w-[256px] h-[60px] rounded-[5px] px-2 text-[14px] focus:outline-none'
                onChange={handleFindDelegatee}
              />
              <div className='text-text text-[12px] self-start ml-2'>
                { alertMessage }
              </div>
              <CustomButton onClick={() => handleAddDelegate()} type={`${activeButton ? 'primary' : 'disabled'}`} className='!w-[256px] !h-[38px] mt-8 flex justify-center items-center'>
                <span className='text-[16px]'>
                {
                  loading ? <Spinner /> : 'Agregar'
                }
                </span>
              </CustomButton>
            </>
          :
            <div className='flex flex-col items-center justify-center h-[270px]'>
              <div className='text-center'>Delegado fue Agregado</div>
              <CustomButton onClick={(e) => { onClose(e); resetData()}} type='primary' className='!w-[256px] !h-[38px] mt-8'>
                <span className='text-[16px]'>
                  Continuar
                </span>
              </CustomButton>
            </div>
        }
      </div>
    </BaseDialog>
  )
}
