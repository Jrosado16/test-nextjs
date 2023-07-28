import { IMarketDataProvider } from "./markets.interface"

export interface IUserTypeDetail {
  acumulated_interest: number
  company_id: string
  delegated: number
  delegator_id: string
  deposit: number
  email: string
  isDelegator: true
  total_debt: number
  total_principal: number
}
export interface IUserDetail {
  userDetail: IUserTypeDetail
}
export interface IInitState {
  userDetail: IUserTypeDetail | null
  loading: boolean
  delegations: IDelegateesWithDelegations | []
  userAccountData: IUserAccountData | undefined
  currentDelegation: IDelegations | {}
  showDelegationDialog: boolean
  delegatorData: IMarketDataProvider | null
  dataLoaded:  boolean
  borrowingsHistory: IDelegations[] | []
  totalDelegateesDebt: number
  existActiveDelegations: boolean
}

export interface IDelegations {
  acumulated_interest: number
  amount: number
  asset_id: string
  delegatee_id: string
  delegation_id: string
  delegator_id: string
  end_date: {
    _seconds: number
  }
  is_active: boolean
  paid_interest: number
  proportion: number
  start_date: {
    _seconds: number
  }
  total_borrow: number
  total_debt: number
  total_principal: number
  type: string
}
export interface IOneDelegatees {
  company_id: string
  delegatee_id: string
  delegations: IDelegations[] | []
  email: string
  name: string
}

export interface IDelegateesWithDelegations {
  delegatees: IOneDelegatees[] | []
}

export interface IUserAccountData {
  totalCollateralUSD: number
  totalDebtUSD: number
  availableBorrowsUSD: number
  currentLiquidationThreshold: number
  ltv: number
  healthFactor: number
}