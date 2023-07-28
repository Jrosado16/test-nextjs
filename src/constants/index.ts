import usdcSVG from '@/assets/market/usdc.svg';
import ethSVG from '@/assets/market/eth.svg';
import btcSVG from '@/assets/market/btc.svg';

const networks = {
  137: {
    name: 'Polygon Mainnet',
    chainId: 137,
    label: 'Mainnet',
  },
  80001: {
    name: 'Polygon Mumbai',
    chainId: 80001,
    label: 'Testnet',
  },
  1442: {
    name: 'Polygon zkevm',
    chainId: 1442,
    label: 'Testnet',
  },
  1101: {
    name: 'Polygon zkevm',
    chainId: 1101,
    label: 'Mainnet',
  },
};
interface ContractProperties {
  WETHGateway?: string;
  LENDING_POOL: string;
  USDC_CONTRACT: string;
  USDC_VARIABLE_DEBT_TOKEN: string;
  USDC_A_TOKEN: string;
  USDC_STABLE_DEBT_TOKEN: string;
  USDC_DECIMALS: number;
  PROTOCOL_DATA_PROVIDER: string;
  LENDING_POOL_ADDRESS_PROVIDER: string;
  AAVE_ORACLE?: string;
  ORACLE_DECIMALS?: number;
  TOKENS?: {
    USDC: string;
    WETH: string;
    WBTC: string;
  };
  ATOKENS?: {
    USDC: string;
    WETH: string;
    WBTC: string;
  };
}

interface Contracts {
  [key: number]: ContractProperties;
}

const contracts: Contracts = {
  80001: {
    LENDING_POOL: "0x9198F13B08E299d85E096929fA9781A1E3d5d827",
    USDC_CONTRACT: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
    USDC_VARIABLE_DEBT_TOKEN: "0x05771A896327ee702F965FB6E4A35A9A57C84a2a",
    USDC_A_TOKEN: "0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9",
    USDC_STABLE_DEBT_TOKEN: "0x83A7bC369cFd55D9F00267318b6D221fb9Fa739F",
    USDC_DECIMALS: 6,
    PROTOCOL_DATA_PROVIDER: "0xFA3bD19110d986c5e5E9DD5F69362d05035D045B",
    LENDING_POOL_ADDRESS_PROVIDER: "0x178113104fEcbcD7fF8669a0150721e231F0FD4B",
  },
  137: {
    LENDING_POOL: "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf",
    USDC_CONTRACT: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDC_VARIABLE_DEBT_TOKEN: "0x248960A9d75EdFa3de94F7193eae3161Eb349a12",
    USDC_A_TOKEN: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
    USDC_STABLE_DEBT_TOKEN: "0xdeb05676dB0DB85cecafE8933c903466Bf20C572",
    USDC_DECIMALS: 6,
    PROTOCOL_DATA_PROVIDER: "0x7551b5D2763519d4e37e8B81929D336De671d46d",
    LENDING_POOL_ADDRESS_PROVIDER: "0xd05e3E715d945B59290df0ae8eF85c1BdB684744",
  },
  1101: {
    WETHGateway: '0xcEBfF8F32607eEC13b5976B14356d13Ba330aC9a',
    LENDING_POOL: "0xB57B04F4ab792215D7CF77ED51330951143E69a8",
    USDC_CONTRACT: "0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035",
    USDC_VARIABLE_DEBT_TOKEN: "0x5B7E77e3b78b1DaB8F88Ab78d5b795B330c5E640",
    USDC_A_TOKEN: "0xf87c0903F2ad2063f385379887071CC7653b02cb",
    USDC_STABLE_DEBT_TOKEN: "0xaE10CE9711Aefcc2C4376425A2648AEb90eEA002",
    USDC_DECIMALS: 6,
    PROTOCOL_DATA_PROVIDER: "0x1d2a3bcfC12FdA29c646005F222C52F124Fd217F",
    LENDING_POOL_ADDRESS_PROVIDER: "0xcF8aB07671BfdBc94399607B5D1e0cF2708fcED6",
    AAVE_ORACLE: '0xB75fB011D06651bFa1690cc458002E7B3064D12C',
    ORACLE_DECIMALS: 18,
    TOKENS: {
      USDC: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
      WETH: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
      WBTC: '0xEA034fb02eB1808C2cc3adbC15f447B93CbE08e1',
    },
    ATOKENS: {
      USDC: '0xf87c0903F2ad2063f385379887071CC7653b02cb',
      WETH: '0x3C89580958967b3945c2ed8a77a98df00c93C66f',
      WBTC: '0x3143aDebf55926E64B94413bdD0CaE63ac2F3F64'      
    },   
  },
  1442: {
    WETHGateway: '0x696bF56059272aAe2DACF7979F49ccb3FE584D39',
    LENDING_POOL: "0xDB7495195c7baab63dD5d2c3781a4B663FabF080",
    USDC_CONTRACT: "0xEc36899D4Cd6f72ba610aF6AC3B60ed1e954124a",
    USDC_VARIABLE_DEBT_TOKEN: "0x9E186739968B5743f96D8B8Fe2C2c89bd7284B50",
    USDC_A_TOKEN: "0x526D65B477677A1274eF414c44114D85c3e790E5",
    USDC_STABLE_DEBT_TOKEN: "0x34e04bACA5fe0720A42FcBB709Dc3c767Df201BD",
    USDC_DECIMALS: 6,
    PROTOCOL_DATA_PROVIDER: "0x6419d3A306A8fBB259fAB055366edc4C06Cf3c78",
    LENDING_POOL_ADDRESS_PROVIDER: "0xee842d026539Fc3c21899fb78Aea5076c53C232f",
    AAVE_ORACLE: '0xeFAE8033eb9cb2461cD29001a05a285EEF980384',
    ORACLE_DECIMALS: 18,
    TOKENS: {
      USDC: '0xEc36899D4Cd6f72ba610aF6AC3B60ed1e954124a',
      WETH: '0x8e7E10956eBfb7C8F41cb4E96A02574b4DC7f1Cb',
      WBTC: '0xCCEF0Dd1f507A6bA5FD98841C835B582DE2D3084',
    },
    ATOKENS: {
      USDC: '0x526D65B477677A1274eF414c44114D85c3e790E5',
      WETH: '0xa321bce3F51B070ACCBe7fF3fF195eeEA2924cC8',
      WBTC: '0x0AD9f7d801df90d5b7d4C99E78b47001cDeEBDB0'      
    },   
  },
};

const JSON_RPC = {
  80001: 'https://matic-mumbai.chainstacklabs.com',
  137: 'https://matic-mainnet.chainstacklabs.com',
  1101: 'https://zkevm-rpc.com',
  1442: 'https://rpc.public.zkevm-test.net',
};

const EXPLORER = {
  80001: 'https://mumbai.polygonscan.com/tx',
  137: 'https://polygonscan.com/tx',
  1442: 'https://testnet-zkevm.polygonscan.com/tx',
  1101: 'https://zkevm.polygonscan.com/tx',
};

const WALLET_NAME = {
  MM: 'METAMASK',
  W3A: 'WEB3AUTH',
}

const CHAIN_ID = {
  POLYGON_T: 80001,
  POLYGON_M: 137,
  ZKEVM_T: 1442,
  ZKEVM_M: 1101,
}

const ACTION = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  BORROW: 'borrow',
  REPAY: 'repay',
  DELEGATION: 'delegation',
  REPAY_DEBT_DELEGATION: 'repay_debt_delegation'
}
const ACTION_LABELS = {
  deposit: 'Deposita',
  withdraw: 'Retirar',
  borrow: 'Pedir prestado',
  repay: 'Pagar',
  delegation: 'Delegar',
  [ACTION.REPAY_DEBT_DELEGATION]: 'Pagar deuda de Delegado'
};

const ZK_TOKENS = {
  USDC: 'USDC',
  WETH: 'WETH',
  WBTC: 'WBTC'
}

const MARKET_IMAGE = {
  'USDC': usdcSVG,
  'WBTC': btcSVG,
  'WETH': ethSVG,
}

export {
  networks,
  contracts,
  WALLET_NAME,
  JSON_RPC,
  EXPLORER,
  CHAIN_ID,
  ACTION,
  ACTION_LABELS,
  ZK_TOKENS,
  MARKET_IMAGE,
};
