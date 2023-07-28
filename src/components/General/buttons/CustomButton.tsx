import React, { MouseEventHandler } from 'react';
type props = {
  children: React.ReactNode,
  type: 'outline' | 'secondary' | 'primary' | 'disabled',
  className?: string
  onClick: MouseEventHandler
}

export default function CustomButton({ type, children, className, onClick }: props) {
  return (
    <button className={`btn text-[12px] md:text-[20px] btn-${type} ${className} md:h-[48px] md:w-[204px]`} onClick={onClick}>
      {children}
    </button>
  )
}
