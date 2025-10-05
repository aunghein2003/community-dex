import { API } from "@orderly.network/types";
import { SharePnLConfig } from "@orderly.network/ui-share";
import { TabType } from "../../orders.widget";
import { useSymbolContext } from "../../provider/symbolContext";

export const useOrderCellScript = (props: {
  item: API.AlgoOrderExt;
  index: number;
  type: TabType;
  sharePnLConfig?: SharePnLConfig;
  onSymbolChange?: (symbol: API.Symbol) => void;
}) => {
  const symbolInfo = useSymbolContext();
  return {
    ...props,
    ...symbolInfo,
    // use symbolInfo replace ...symbolInfo
    symbolInfo,
  };
};

export type OrderCellState = ReturnType<typeof useOrderCellScript>;
