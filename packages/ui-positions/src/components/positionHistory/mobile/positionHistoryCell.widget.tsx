import { API } from "@orderly.network/types";
import { PositionHistoryExt } from "../positionHistory.script";
import { usePositionHistoryCellScript } from "./positionHistoryCell.script";
import { PositionHistoryCell } from "./positionHistoryCell.ui";
import { SharePnLConfig } from "@orderly.network/ui-share";

export const PositionHistoryCellWidget = (props: {
  item: PositionHistoryExt;
  onSymbolChange?: (symbol: API.Symbol) => void;
  index: number;
  classNames?: {
    root?: string;
  };
  sharePnLConfig?: SharePnLConfig;
}) => {
  const state = usePositionHistoryCellScript(props);
  return <PositionHistoryCell {...state} />;
};
