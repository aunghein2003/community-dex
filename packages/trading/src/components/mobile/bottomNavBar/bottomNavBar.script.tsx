import { useAccount } from "@orderly.network/hooks";
import { useAppContext } from "@orderly.network/react-app";

export const useBottomNavBarScript = () => {
  const { wrongNetwork, disabledConnect } = useAppContext();
  const { account, state } = useAccount();

  /** link device, acally wallet not connect */
  const onDisconnect = async () => {
    localStorage.removeItem("orderly_link_device");
    await account.disconnect();
  };

  return {
    wrongNetwork,
    disabledConnect,
    status: state.status,
    onDisconnect,
  };
};

export type BottomNavBarState = ReturnType<typeof useBottomNavBarScript>;
