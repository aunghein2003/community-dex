import React from "react";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WalletConnectorProvider>
      <OrderlyAppProvider
        brokerId="orderly"
        brokerName="Orderly"
        networkId="testnet"
      >
        {children}
      </OrderlyAppProvider>
    </WalletConnectorProvider>
  );
};
export default Provider;
