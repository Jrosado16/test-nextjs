import React, { ChangeEventHandler, MouseEventHandler, useState } from 'react';

interface IProps {
  onClick: MouseEventHandler,
  onChange: ChangeEventHandler
  value: any
}

export default function CustomInput({ onClick, value, onChange }: IProps) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  }
  const handleBlur = () => {
    setIsFocused(false);
  }

  return (
    <div className={`bg-fields h-[60px] rounded-[5px] flex px-4 border ${isFocused ? 'border-hover' : 'border-fields'} `}>
      <input type="text" placeholder='0 USDC' className='focus:outline-none bg-fields w-1/2 flex-1'
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value === 0 ? '' : value}
        onChange={onChange}
      />
      <button className='h-[20px] self-center' onClick={onClick}>MAX</button>
    </div>
  )
}
