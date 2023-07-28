export interface ITransaction {
  type: IActionType
  amount: number
  hash: string
  step: number
  token: string
  error: boolean
}

export interface IActionState {
  transaction: ITransaction
  isOpenDialogTx: boolean
  loadingAction: boolean
}

export type IActionType = 'deposit' | 'withdraw' | 'borrow' | 'repay' | 'delegation' | 'repay_debt_delegation';