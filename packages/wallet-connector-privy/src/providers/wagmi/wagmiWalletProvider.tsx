import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { ChainNamespace } from "@orderly.network/types";
import { useWalletConnectorPrivy } from "../../provider";

interface WagmiWalletContextValue {
  connectors: Connector[];
  connect: (args: any) => void;
  wallet: any;
  connectedChain: { id: number; namespace: ChainNamespace } | null;
  setChain: (chainId: number) => Promise<any>;
  disconnect: () => void;
  isConnected: boolean;
}

const WagmiWalletContext = createContext<WagmiWalletContextValue | null>(null);

export const WagmiWalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connectorWalletType } = useWalletConnectorPrivy();
  const [wallet, setWallet] = useState<undefined | any>(undefined);
  const { connect, connectors: wagmiConnectors } =
    connectorWalletType.disableWagmi
      ? { connect: () => Promise.resolve(), connectors: [] }
      : useConnect();
  const { disconnect } = connectorWalletType.disableWagmi
    ? { disconnect: () => Promise.resolve() }
    : useDisconnect();
  const { connector, isConnected, address, chainId } =
    connectorWalletType.disableWagmi
      ? { connector: null, isConnected: false, address: null, chainId: null }
      : useAccount();
  const { switchChain } = connectorWalletType.disableWagmi
    ? { switchChain: () => Promise.resolve() }
    : useSwitchChain();

  const connectedChain = useMemo(() => {
    if (chainId) {
      return {
        id: chainId,
        namespace: ChainNamespace.evm,
      };
    }
    return null;
  }, [chainId]);

  const setChain = useCallback(
    (chainId: number) => {
      return new Promise((resolve, reject) => {
        switchChain(
          { chainId },
          {
            onSuccess: () => resolve(true),
            onError: (e) => {
              console.log("-- switch chain error", e);
              return reject(e);
            },
          },
        );
      });
    },
    [switchChain],
  );

  useEffect(() => {
    if (!connector || !isConnected) {
      console.log("-- xxx wagmi wallet setundefine", isConnected);
      setWallet(undefined);
      return;
    }
    connector.getProvider?.().then((provider) => {
      setWallet({
        label: connector.name,
        icon: "",
        provider: provider,
        accounts: [
          {
            address: address,
          },
        ],
        chains: [
          {
            id: chainId,
            namespace: ChainNamespace.evm,
          },
        ],
        chain: connectedChain,
      });
    });
  }, [connector, chainId, isConnected, address, connectedChain]);

  const connectors = useMemo(() => {
    return wagmiConnectors
      .filter((connector: any) => connector.id !== "injected")
      .sort((a: any, b: any) =>
        a.type === "injected" ? -1 : 1,
      ) as Connector[];
  }, [wagmiConnectors]);

  const value = useMemo(
    () => ({
      connectors,
      connect,
      wallet,
      connectedChain,
      setChain,
      disconnect,
      isConnected,
    }),
    [
      connectors,
      connect,
      wallet,
      connectedChain,
      setChain,
      disconnect,
      isConnected,
    ],
  );

  return (
    <WagmiWalletContext.Provider value={value}>
      {children}
    </WagmiWalletContext.Provider>
  );
};

export function useWagmiWallet() {
  const context = useContext(WagmiWalletContext);
  if (!context) {
    throw new Error("useWagmiWallet must be used within a WagmiWalletProvider");
  }
  return context;
}
