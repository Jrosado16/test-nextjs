import React, { MouseEventHandler, useState } from 'react'

type props = {
  isOpen: boolean,
  onClose: MouseEventHandler,
  children: React.ReactNode,
  className?: string,
  backgroundImage?: string
}

export default function BaseDialog({ children, isOpen, onClose, className, backgroundImage }: props) {
  const [scale, setScale] = useState(1);
  
  const handleClick = () => {
    setScale(1.01);
    setTimeout(() => {
      setScale(1);
    }, 100);
  }
  if (!isOpen) return null;
  return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-70">
      <div className="flex items-center justify-center h-screen w-screen" onClick={() => handleClick()}>
        <div className={`${className} relative min-w-[313px] min-h-[342px] bg-background rounded-lg text-left overflow-hidden shadow-xl transform transition-transform duration-100 ease-in`}
          style={{ transform: `scale(${scale})`, backgroundImage:  `url(${backgroundImage})`, backgroundSize: 'cover'}} onClick={(e) => e.stopPropagation()}>
          <div className="absolute right-0 top-0 bg-gray-50 text-text px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" className="" onClick={onClose}>
              x
            </button>
          </div>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
