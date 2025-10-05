import { useEffect, useMemo, useRef, useState } from "react";
import {
  useConfig,
  useEventEmitter,
  useTrack,
  WalletState,
} from "@orderly.network/hooks";
import {
  useAccount,
  useChains,
  useKeyStore,
  useWalletConnector,
} from "@orderly.network/hooks";
import {
  AccountStatusEnum,
  SDKError,
  ChainNamespace,
  NetworkId,
  TrackerEventName,
  ABSTRACT_CHAIN_ID_MAP,
} from "@orderly.network/types";
import {
  parseChainIdToNumber,
  praseChainIdToNumber,
  windowGuard,
} from "@orderly.network/utils";
import { getLinkDeviceData } from "./useLinkDevice";

const WALLET_KEY = "orderly:wallet-info";
const CHAIN_NAMESPACE = "orderly:chain-namespace";

export const useWalletStateHandle = (options: {
  // onChainChanged?: (chainId: number, isTestnet: boolean) => void;
  currentChainId?: number;
}) => {
  const {
    wallet: connectedWallet,
    connect,
    connectedChain,
    disconnect,
    namespace,
  } = useWalletConnector();
  //
  // console.log("🔗 wallet state handle", {
  //   connectedWallet,
  //   connectedChain,
  //   namespace,
  // });

  if (typeof connect !== "function") {
    throw new SDKError("Please provide a wallet connector provider");
  }

  const ee = useEventEmitter();
  const isManualConnect = useRef<boolean>(false);
  const brokerId = useConfig("brokerId");
  const { account, state: accountState } = useAccount();
  const keyStore = useKeyStore();
  const networkId = useConfig("networkId") as NetworkId;
  const [chains, { checkChainSupport }] = useChains();

  const [unsupported, setUnsupported] = useState(false);
  const { track, setTrackUserId } = useTrack();

  // current connected wallet address
  const currentWalletAddress = useMemo<string | undefined>(() => {
    return connectedWallet?.accounts?.[0]?.address;
  }, [connectedWallet]);

  // current connected chain id
  const currentChain = useMemo<
    { id: number; namespace: string } | undefined
  >(() => {
    const id = connectedWallet?.chains?.[0]?.id;
    const namespace = connectedWallet?.chains?.[0]?.namespace as string;
    if (typeof id === "undefined") return undefined;
    return {
      id: parseChainIdToNumber(id),
      namespace,
    };
  }, [connectedWallet]);

  useEffect(() => {
    if (
      accountState.status >= AccountStatusEnum.EnableTrading &&
      account.accountId
    ) {
      setTrackUserId(account.accountId!);
    }
  }, [account, accountState]);

  useEffect(() => {
    if (!connectedChain) {
      setUnsupported(false);
      return;
    }

    let isSupported = checkChainSupport(
      connectedChain.id,
      networkId,
      // networkId === "testnet" ? chains.testnet : chains.mainnet
    );
    if (
      ABSTRACT_CHAIN_ID_MAP.has(parseInt(connectedChain.id as string)) &&
      connectedWallet?.label !== "AGW"
    ) {
      isSupported = false;
    }

    setUnsupported(!isSupported);
  }, [connectedChain, chains, checkChainSupport, networkId, connectedWallet]);

  useEffect(() => {
    // if (unsupported) return;

    windowGuard(() => {
      const localAddress = keyStore.getAddress();
      const walletInfo = JSON.parse(localStorage.getItem(WALLET_KEY) ?? "{}");

      /**
       * if locale address is exist, restore account state
       */
      if (connectedChain?.namespace === ChainNamespace.solana) {
        return;
      }
      if (
        localAddress &&
        account.address !== localAddress &&
        walletInfo.label
      ) {
        connect({
          autoSelect: {
            label: walletInfo.label,
            disableModals: true,
          },
        }).then(
          (res) => {
            console.log("silent connect wallet successes", res);
          },
          (error) => console.log("connect error", error),
        );
      }
    });
  }, [connectedWallet, account.address]);

  /**
   * handle wallet connection
   */
  useEffect(() => {
    if (
      connectedWallet === null &&
      accountState.status > AccountStatusEnum.NotConnected &&
      !accountState.validating
    ) {
      account.disconnect();
      return;
    }

    if (unsupported || !connectedChain) return;
    if (isManualConnect.current) return;

    const linkData = getLinkDeviceData();

    // updateAccount(currentWalletAddress!, connectedWallet!, currentChainId!);
    /**
     * switch account
     */
    if (
      !!currentWalletAddress &&
      currentWalletAddress !== account.address &&
      !linkData
    ) {
      account.setAddress(currentWalletAddress, {
        provider: connectedWallet?.provider,
        chain: {
          id: praseChainIdToNumber(currentChain!.id),
          namespace: currentChain!.namespace.toUpperCase() as ChainNamespace,
        },
        wallet: {
          name: connectedWallet?.label ?? "",
        },
        additionalInfo: connectedWallet?.additionalInfo ?? {},
      });
      track(TrackerEventName.walletConnect, {
        wallet: connectedWallet?.label ?? "",
        network: currentChain!.namespace.toUpperCase() as ChainNamespace,
      });

      // save wallet connector info to local storage
      windowGuard(() => {
        localStorage.setItem(
          WALLET_KEY,
          JSON.stringify({
            label: connectedWallet?.label ?? "",
          }),
        );
      });
    }

    /**
     * switch chainId
     */
    if (currentChain?.id !== account.chainId) {
      account.switchChainId(currentChain?.id!);

      // emit chain changed event
      // options.onChainChanged?.(currentChainId!, isTestnet(networkId));
    }
  }, [
    connectedWallet,
    connectedChain,
    currentWalletAddress,
    currentChain,
    account.address,
    accountState,
    account.chainId,
    unsupported,
  ]);

  /**
   * User manually connects to wallet
   */
  const connectWallet = async (): Promise<{
    wallet?: WalletState;
    status?: AccountStatusEnum;
    wrongNetwork?: boolean;
  } | null> => {
    isManualConnect.current = true;
    // const walletState = await connect();

    return connect({ chainId: options.currentChainId })
      .then(async (walletState) => {
        if (
          Array.isArray(walletState) &&
          walletState.length > 0 &&
          walletState[0] &&
          walletState[0].accounts.length > 0
        ) {
          const wallet = walletState[0];
          const chainId = praseChainIdToNumber(wallet.chains[0].id);

          if (!checkChainSupport(chainId, networkId)) {
            return {
              wrongNetwork: true,
            };
          }
          //
          if (!account) {
            throw new Error("account is not initialized");
          }
          // clear link device data when connect wallt
          if (
            accountState.status ===
            AccountStatusEnum.EnableTradingWithoutConnected
          ) {
            localStorage.removeItem("orderly_link_device");
            await account.disconnect();
          }

          const status = await account.setAddress(wallet.accounts[0].address, {
            provider: wallet.provider,
            chain: {
              id: praseChainIdToNumber(wallet.chains[0].id),
              namespace:
                wallet.chains[0].namespace.toUpperCase() as ChainNamespace,
            },
            wallet: {
              name: wallet.label,
            },
            // label: ,
          });
          track(TrackerEventName.walletConnect, {
            wallet: wallet.label,
            network: wallet.chains[0].namespace.toUpperCase() as ChainNamespace,
          });
          console.log("-- xxxxxx status", status);

          return { wallet, status, wrongNetwork: false };
        }

        return null;
      })
      .finally(() => {
        isManualConnect.current = false;
      });
  };

  return {
    connectWallet,
    wrongNetwork: unsupported,
  };
};
