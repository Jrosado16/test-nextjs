'use client'
import React, { useState } from 'react'
import palms from '@/assets/palms.png';
import { createUser, findUser } from '@/services/userService';
import { getAccount, getNetwork } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/chart/Spiner';
import { useAppDispatch } from '@/redux/hooks';
import { fetchUserDetail } from '@/redux/slices/userSlice';

type userType = 'delegatee' | 'delegator';

const useCreateUser = () => {
  const [user, setUser] = useState<userType>('delegator');
  const [nickname, setNickname] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [activeButton, setActiveButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const handleFindUser = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 4) {
      const data:any = await findUser(e.target.value);
      const existUser = data.userDetail.company_id === e.target.value;
      if (existUser) {
        setAlertMessage('Usuario ya existe');
        setActiveButton(false);
      } else {
        setAlertMessage('');
        setActiveButton(true);
      }
      setNickname(e.target.value);
    } else {
      setNickname(e.target.value);
      setAlertMessage('Debe tener al menos 4 caracteres');
      setActiveButton(false);
    }
  }
  
  const handleCreateUser = async () => {
    try {
      if (!activeButton || nickname.length <= 4 || loading) return;
      setLoading(true);
      const data = {
        email: nickname,
        address: getAccount().address?.toLowerCase(),
        company_id: '',
        name: nickname,
        chainId: getNetwork().chain?.id,
        user_type: user
      };
      const response = await createUser(data);
      console.log('response: ', response);
      await dispatch(fetchUserDetail());
      if (response) router.push('/')
      setLoading(false);
    } catch (error) {
      setAlertMessage('Error, intenta mas tarde');
    }
  }

  return { handleFindUser, user, setUser, alertMessage, loading, activeButton, handleCreateUser }

}

export default function Register() {

  const { handleFindUser, user, setUser, alertMessage, loading, activeButton, handleCreateUser } = useCreateUser();

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col'>
        <img src={palms.src} alt='palms' />
        <p className='text-4xl text-text mt-5'>Escoge tu rol</p>
        <div className='flex mt-5 mb-6'>
          <button className={`btn w-[150px] h-[45px] text-text border ${user === 'delegator' ? 'bg-hover border-hover' : ''} `}
            onClick={() => setUser("delegator")}
          >
            Delegador
          </button>
          <button className={`btn w-[150px] h-[45px] text-text border ml-10 ${user === 'delegatee' ? 'bg-hover border-hover' : ''}`}
            onClick={() => setUser("delegatee")}
          >
            Delegado
          </button>
        </div>
        <div className='text-text text-[14px] mb-2'>Ingresa un Nickname</div>
        <input type="text"
          placeholder='tropykano'
          className={`bg-fields border border-frame h-[50px] focus:outline-none rounded-md w-full px-2 ${alertMessage.length > 0 ? 'border-alert' : ''}`}
          onChange={handleFindUser}
        />
        <div className='text-text text-[12px]'>
          { alertMessage }
        </div>
        <div className='w-[375px] h-[100px] text-text text-[14px] text-justify mt-10'>
          {
            user === 'delegator'
            ?
              <div>
                <p className='mb-3'>
                  Podrás delegar un préstamo a partir del monto que decidas.
                </p>
                Recuerda comunicarle al usuario delegado de hacer este registro para poder acceder al préstamo que delegarás.
              </div>
            :
              <div>
                Podrás recibir un préstamo a partir del monto que el usuario delegador decida.
              </div>
          }
        </div>
        <button
          className={`self-end content-end flex justify-center items-center w-[185px] h-[45px] bg-disabled mt-7 rounded-[5px] ${activeButton && !loading ? 'btn-primary' : 'bg-disabled'}`}
          onClick={handleCreateUser}  
        >
          {
            loading ? <Spinner /> : 'Continuar'
          }
        </button>
      </div>
    </div>
  )
}

