import { useMemo } from "react";
import { API, OrderlyOrder } from "@orderly.network/types";
import { Decimal, zero } from "@orderly.network/utils";
import { useAskAndBid } from "../../../hooks/useAskAndBid";

export type ScaledOrderConfirmScriptOptions = {
  order: OrderlyOrder & {
    orders: OrderlyOrder[];
  };
  symbolInfo: API.SymbolExt;
};

export type ScaledOrderConfirmScriptReturns = ReturnType<
  typeof useScaledOrderConfirmScript
>;

export function useScaledOrderConfirmScript(
  options: ScaledOrderConfirmScriptOptions,
) {
  const { order, symbolInfo } = options;
  const orders = order.orders;

  const askAndBid = useAskAndBid();

  const national = useMemo(() => {
    const national = orders.reduce((acc, order) => {
      return acc.add(new Decimal(order.order_price).mul(order.order_quantity));
    }, zero);

    return national.toNumber();
  }, [orders]);

  const totalQuantity = useMemo(() => {
    const totalQuantity = orders.reduce((acc, order) => {
      return acc.add(new Decimal(order.order_quantity));
    }, zero);

    return totalQuantity.toString();
  }, [orders, symbolInfo.base_dp]);

  return { dataSource: orders, national, askAndBid, totalQuantity };
}
