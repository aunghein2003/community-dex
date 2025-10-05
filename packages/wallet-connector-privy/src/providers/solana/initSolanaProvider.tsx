import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import {
  Adapter,
  WalletAdapterNetwork,
  WalletError,
  WalletNotReadyError,
} from "@solana/wallet-adapter-base";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWalletConnectorPrivy } from "../../provider";
import { InitSolana } from "../../types";

interface IProps extends PropsWithChildren<InitSolana> {}

export function InitSolanaProvider({
  mainnetRpc,
  devnetRpc,
  wallets: walletsProp,
  onError,
  children,
}: IProps) {
  const { network, setSolanaInfo, connectorWalletType } =
    useWalletConnectorPrivy();
  if (connectorWalletType.disableSolana) {
    return children;
  }

  const wallets = useMemo(() => {
    return walletsProp ?? [new PhantomWalletAdapter()];
  }, [walletsProp]);

  useEffect(() => {
    let rpcUrl = null;
    if (network === "mainnet") {
      rpcUrl = mainnetRpc ?? null;
    } else {
      rpcUrl = devnetRpc ?? null;
    }
    setSolanaInfo({
      rpcUrl: rpcUrl,
      network:
        network === "mainnet"
          ? WalletAdapterNetwork.Mainnet
          : WalletAdapterNetwork.Devnet,
    });
  }, [network, mainnetRpc, devnetRpc, setSolanaInfo]);
  return (
    <WalletProvider wallets={wallets} onError={onError} autoConnect>
      {children}
    </WalletProvider>
  );
}
