'use client'
import React, { useEffect, useRef, useState } from 'react'
import downArrowIcon from '@/assets/icon/downArrow.svg';
import upArrowIcon from '@/assets/icon/upArrow.svg';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

type props = {
  defaultData: any,
  children: React.ReactNode,
  rounded?: number,
  className?: string
}

export default function CustomDropdown({ defaultData, children, rounded = 20, className }: props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const userDetail = useAppSelector((state:RootState) => state.user.userDetail);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setIsOpen(false);
  }

  return (
    <div className={`${className} w-[108px] md:w-[134px] relative h-[32px] md:self-center self-start md:h-[44px] rounded-[20px]`} ref={ref}>
      <button type="button" className="flex justify-center content-center items-center w-full hover:bg-gray-50 focus:outline-none h-full" id="options-menu" aria-expanded="true" aria-haspopup="true" onClick={() => setIsOpen(!isOpen)}>
        <span>{ defaultData }</span>
        {
          userDetail?.isDelegator && 
          <img src={ isOpen ? upArrowIcon.src : downArrowIcon.src } alt="" className='absolute right-0 mr-2' />
        }
      </button>
      {(isOpen && userDetail?.isDelegator) && (
        <div className={`w-full origin-top-right absolute left-0 rounded-[${rounded}px] shadow-lg bg-bg2 focus:outline-none`} onClick={handleClick}>
          { children }
        </div>
      )}
    </div>
  )
}
