import {
  BSC_TESTNET_CHAINID,
  ABSTRACT_CHAIN_ID_MAP,
  MONAD_TESTNET_CHAINID,
  STORY_TESTNET_CHAINID,
} from "@orderly.network/types";
import { ConfigStore } from "./configStore/configStore";
import {
  mainnetUSDCAddress,
  mainnetVaultAddress,
  mainnetVerifyAddress,
  nativeUSDCAddress,
  solanaDevVaultAddress,
  solanaMainnetUSDCAddress,
  solanaMainnetVaultAddress,
  solanaQaVaultAddress,
  solanaStagingVualtAddress,
  solanaUSDCAddress,
  stagingStoryTestnetVaultAddress,
  stagingUSDCAddressOnArbitrumTestnet,
  stagingVaultAddressOnArbitrumTestnet,
  stagingVerifyAddressOnArbitrumTestnet,
  stagingMonadTestnetVaultAddress,
  MonadTestnetUSDCAddress,
  qaMonadTestnetVaultAddress,
  stagingAbstractTestnetVaultAddress,
  AbstractTestnetUSDCAddress,
  abstractMainnetVaultAddress,
  AbstractQaVaultAddress,
  AbstractDevVaultAddress,
  AbstractMainnetUSDCAddress,
  bscMainnetVaultAddress,
  bscMainnetUSDCAddress,
  bscTestnetQaVaultAddress,
  bscTestnetUSDCAddress,
  bscTestnetDevVaultAddress,
  bscTestnetStagingVaultAddress,
  qaArbitrumTestnetVaultAddress,
} from "./constants";
import mainnetUSDCAbi from "./wallet/abis/mainnetUSDCAbi.json";
import mainnetVaultAbi from "./wallet/abis/mainnetVaultAbi.json";
import stagingUSDCAbiOnArbitrumTestnet from "./wallet/abis/stagingUSDCAbi.json";
import stagingVaultAbiOnArbitrumTestnet from "./wallet/abis/stagingVaultAbi.json";

/**
 * Orderly contracts information
 */
export type OrderlyContracts = {
  usdcAddress: string;
  usdcAbi: any;
  erc20Abi: any;
  vaultAddress: string;
  vaultAbi: any;
  verifyContractAddress: string;
  solanaUSDCAddress: string;
  solanaVaultAddress: string;
  // only for testnet, mainnet vault on evm chain is all same address
  storyTestnetVaultAddress?: string;
  monadTestnetVaultAddress?: string;
  monadTestnetUSDCAddress?: string;
  abstractVaultAddress?: string;
  abstractUSDCAddress?: string;
  bscVaultAddress?: string;
  bscUSDCAddress?: string;
};

export interface IContract {
  getContractInfoByEnv(): OrderlyContracts;
}

/** @hidden */
export class BaseContract implements IContract {
  constructor(private readonly configStore: ConfigStore) {}

  getContractInfoByEnv() {
    const networkId = this.configStore.get("networkId");
    const env = this.configStore.get("env");
    let verifyContractAddress = stagingVerifyAddressOnArbitrumTestnet;

    if (networkId === "mainnet") {
      return {
        usdcAddress: mainnetUSDCAddress,
        usdcAbi: mainnetUSDCAbi,
        vaultAddress: mainnetVaultAddress,
        vaultAbi: mainnetVaultAbi,
        verifyContractAddress: mainnetVerifyAddress,
        erc20Abi: mainnetUSDCAbi,
        solanaUSDCAddress: solanaMainnetUSDCAddress,
        solanaVaultAddress: solanaMainnetVaultAddress,
        abstractVaultAddress: abstractMainnetVaultAddress,
        abstractUSDCAddress: AbstractMainnetUSDCAddress,
        bscVaultAddress: bscMainnetVaultAddress,
        bscUSDCAddress: bscMainnetUSDCAddress,
      };
    }

    let solanaVaultAddress = solanaStagingVualtAddress;
    let storyTestnetVaultAddress = stagingStoryTestnetVaultAddress;
    let monadTestnetVaultAddress = stagingMonadTestnetVaultAddress;
    const monadTestnetUSDCAddress = MonadTestnetUSDCAddress;
    let abstractVaultAddress = stagingAbstractTestnetVaultAddress;
    const abstractUSDCAddress = AbstractTestnetUSDCAddress;
    let bscVaultAddress = bscTestnetStagingVaultAddress;
    let bscUSDCAddress = bscTestnetUSDCAddress;
    let vaultAddress = stagingVaultAddressOnArbitrumTestnet;
    if (env === "qa") {
      solanaVaultAddress = solanaQaVaultAddress;
      verifyContractAddress = "0x50F59504D3623Ad99302835da367676d1f7E3D44";
      storyTestnetVaultAddress = "0xFeA61647309cA4624EfF3c86EEEeb76a6F3eaFf7";
      monadTestnetVaultAddress = qaMonadTestnetVaultAddress;
      abstractVaultAddress = AbstractQaVaultAddress;
      bscVaultAddress = bscTestnetQaVaultAddress;
      bscUSDCAddress = bscTestnetUSDCAddress;
      vaultAddress = qaArbitrumTestnetVaultAddress;
    } else if (env === "dev") {
      abstractVaultAddress = AbstractDevVaultAddress;
      bscVaultAddress = bscTestnetDevVaultAddress;
      bscUSDCAddress = bscTestnetUSDCAddress;
      verifyContractAddress = "0x8794E7260517B1766fc7b55cAfcd56e6bf08600e";
    }

    return {
      usdcAddress: nativeUSDCAddress,
      usdcAbi: stagingUSDCAbiOnArbitrumTestnet,
      vaultAddress: vaultAddress,
      solanaVaultAddress: solanaVaultAddress,
      solanaUSDCAddress: solanaUSDCAddress,
      vaultAbi: stagingVaultAbiOnArbitrumTestnet,
      verifyContractAddress: verifyContractAddress,
      erc20Abi: stagingUSDCAbiOnArbitrumTestnet,
      storyTestnetVaultAddress: storyTestnetVaultAddress,
      monadTestnetVaultAddress: monadTestnetVaultAddress,
      monadTestnetUSDCAddress: monadTestnetUSDCAddress,
      abstractUSDCAddress: abstractUSDCAddress,
      abstractVaultAddress: abstractVaultAddress,
      bscVaultAddress: bscVaultAddress,
      bscUSDCAddress: bscUSDCAddress,
    };
  }
}

export function getContractInfoByChainId(
  chainId: number,
  contractInfo: OrderlyContracts,
) {
  let vaultAddress = contractInfo.vaultAddress;
  let tokenAddress = contractInfo.usdcAddress;

  if (chainId === STORY_TESTNET_CHAINID) {
    vaultAddress = contractInfo.storyTestnetVaultAddress ?? "";
  }

  if (chainId === MONAD_TESTNET_CHAINID) {
    vaultAddress = contractInfo.monadTestnetVaultAddress ?? "";
    tokenAddress = contractInfo.monadTestnetUSDCAddress ?? "";
  }

  if (ABSTRACT_CHAIN_ID_MAP.has(chainId)) {
    vaultAddress = contractInfo.abstractVaultAddress ?? "";
    tokenAddress = contractInfo.abstractUSDCAddress ?? "";
  }

  if (chainId === BSC_TESTNET_CHAINID) {
    vaultAddress = contractInfo.bscVaultAddress ?? "";
    tokenAddress = contractInfo.bscUSDCAddress ?? "";
  }

  return {
    vaultAddress,
    tokenAddress,
  };
}
