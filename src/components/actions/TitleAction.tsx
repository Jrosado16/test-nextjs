import React from 'react';
import { IActionType } from '../../interfaces/actions.interface';
import { ACTION_LABELS } from '../../constants';


type Props = {
  currentAction: IActionType
}

export default function TitleAction({ currentAction }: Props) {
  return (
    <div className='text-text font-bold text-[16px] m-auto'>
      { ACTION_LABELS[currentAction] }
    </div>
  )
}
