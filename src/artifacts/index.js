import IERC20 from "./IERC20WithPermit.json";
import ICreditDelegationToken from "./ICreditDelegationToken.json";
import ILendingPool from "./ILendingPool.json";
import IProtocolDataProvider from "./IProtocolDataProvider.json";
// import IStableDebtToken from './IStableDebtToken.json'
// import IVariableDebtToken from './IVariableDebtToken.json'
import StableDebtTokenArtifact from "./StableDebtToken.json";
import VariableDebtTokenArtifact from "./VariableDebtToken.json";

const ERC20 = IERC20.abi;
const CreditDelegationToken = ICreditDelegationToken.abi;
const LendingPool = ILendingPool.abi;
const ProtocolDataProvider = IProtocolDataProvider.abi;
const StableDebtToken = StableDebtTokenArtifact.abi;
const VariableDebtToken = VariableDebtTokenArtifact.abi;

export {
  ERC20,
  CreditDelegationToken,
  LendingPool,
  ProtocolDataProvider,
  StableDebtToken,
  VariableDebtToken,
};
