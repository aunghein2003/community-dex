import { FC, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@orderly.network/hooks";
import { EMPTY_LIST } from "@orderly.network/types";
import { cn, Grid, Spinner } from "@orderly.network/ui";
import { BasicSymbolInfo } from "../../../types/types";
import {
  ORDERBOOK_COIN_TYPE_KEY,
  OrderBookProvider,
} from "../../base/orderBook/orderContext";
import { DesktopAsks } from "./asks.desktop";
import { DesktopBids } from "./bids.desktop";
import { DesktopDepthSelect } from "./depthSelect.desktop";
import { DesktopHeader } from "./header.desktop";
import { DesktopMarkPrice } from "./markPrice.desktop";

export interface DesktopOrderBookProps {
  asks: any[];
  bids: any[];
  markPrice: number;
  lastPrice: number[];
  onItemClick?: (item: number[]) => void;
  depths: string[];
  activeDepth?: string;
  onDepthChange?: (depth: number) => void;
  //
  autoSize?: boolean;
  level?: number;
  base: string;
  quote: string;

  isLoading?: boolean;

  cellHeight?: number;

  className?: string;
  pendingOrders?: number[];
  symbolInfo: BasicSymbolInfo;
}

export const DesktopOrderBook: FC<DesktopOrderBookProps> = (props) => {
  const { lastPrice, markPrice, quote, base, isLoading, onDepthChange } = props;

  const divRef = useRef<HTMLDivElement>(null);

  const [showTotal, setShowTotal] = useState(false);

  const [coinType, setCoinType] = useLocalStorage(
    ORDERBOOK_COIN_TYPE_KEY,
    base,
  );

  useEffect(() => {
    if (coinType !== quote && base) {
      setCoinType(base);
    }
  }, [base, quote]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize: width } = entry.borderBoxSize[0];
        setShowTotal(width >= 360);
      }
    });

    const targetDiv = divRef.current;

    if (targetDiv) {
      resizeObserver.observe(targetDiv);
    }

    return () => {
      if (targetDiv) {
        resizeObserver.unobserve(targetDiv);
      }
    };
  }, []);

  return (
    <OrderBookProvider
      cellHeight={props.cellHeight ?? 20}
      onItemClick={props.onItemClick}
      depth={props.activeDepth}
      showTotal={showTotal}
      pendingOrders={props.pendingOrders || EMPTY_LIST}
      symbolInfo={props.symbolInfo}
    >
      <Grid
        cols={1}
        rows={5}
        id="oui-orderbook-desktop"
        ref={divRef}
        className="oui-relative oui-size-full oui-grid-rows-[auto,auto,1fr,auto,1fr]"
      >
        <DesktopDepthSelect
          depths={props.depths}
          value={props.activeDepth}
          onChange={onDepthChange}
        />
        <DesktopHeader quote={quote} base={base} />
        <DesktopAsks data={[...props.asks]} />
        <DesktopMarkPrice
          lastPrice={lastPrice}
          markPrice={markPrice}
          // ======================================================================
          // ==         🔥🔥🔥🔥🔥🔥🔥 DO NOT MODIFY THIS 🔥🔥🔥🔥🔥🔥🔥              ==
          // ======================================================================
          // Use shallow copy here to avoid mutating the original props array when sorting or modifying inside the component.
          // Note: This only clones the array itself, not the element objects.
          asks={[...props.asks]}
          bids={[...props.bids]}
          symbolInfo={props.symbolInfo}
        />
        <DesktopBids data={[...props.bids]} />
        {isLoading && (
          <div className="oui-bg-bg-8/70 oui-absolute oui-inset-0 oui-z-10 oui-flex oui-items-center oui-justify-center">
            <Spinner />
          </div>
        )}
      </Grid>
    </OrderBookProvider>
  );
};
