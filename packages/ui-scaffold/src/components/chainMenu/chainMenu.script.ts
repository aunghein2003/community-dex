import { useEffect, useState } from "react";
import {
  useChains,
  useConfig,
  useAccount,
  useWalletConnector,
} from "@orderly.network/hooks";
import { useAppContext } from "@orderly.network/react-app";
import { API, Chain, NetworkId } from "@orderly.network/types";

export type UseChainMenuScriptReturn = ReturnType<typeof useChainMenuScript>;

export const useChainMenuScript = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { state } = useAccount();
  const { connectedChain } = useWalletConnector();
  const { currentChainId, wrongNetwork, disabledConnect, setCurrentChainId } =
    useAppContext();
  const networkId = useConfig("networkId") as NetworkId;

  const hide = () => {
    setOpen(false);
  };

  const onChainChangeBefore = () => {
    setLoading(true);
    hide();
  };

  const onChainChangeAfter = () => {
    setLoading(false);
  };

  return {
    isConnected: !!connectedChain,
    currentChainId,
    wrongNetwork,
    disabledConnect,
    accountStatus: state.status,
    networkId,
    open,
    onOpenChange: setOpen,
    hide,
    onChainChangeBefore,
    onChainChangeAfter,
    loading,
    setCurrentChainId,
  };
};

export type UseChainMenuBuilderScript = ReturnType<typeof useChainMenuScript>;
