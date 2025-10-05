import { useEffect, useState } from "react";
import { produce } from "immer";
import { OrderlyOrder, OrderType, RequireKeys } from "@orderly.network/types";

export type FullOrderState = OrderlyOrder;

type OrderEntryStateEntity = RequireKeys<
  FullOrderState,
  "side" | "order_type" | "symbol"
>;

const initialOrderState = {
  order_price: "",
  order_quantity: "",
  trigger_price: "",
  tp_trigger_price: "",
  sl_trigger_price: "",
  tp_order_type: OrderType.MARKET,
  tp_pnl: "",
  sl_pnl: "",
  tp_offset_percentage: "",
  sl_offset_percentage: "",
  tp_offset: "",
  sl_offset: "",
  sl_order_type: OrderType.MARKET,
  total: "",

  // scaled order
  start_price: "",
  end_price: "",
  totalOrders: "",
  distribution_type: "",
  skew: "",
  // symbol: "",

  // trailing stop order
  activated_price: "",
  callback_value: "",
  callback_rate: "",
};

export const useOrderStore = (initialOrder: OrderEntryStateEntity) => {
  const [entry, setEntry] = useState<OrderEntryStateEntity>(initialOrder);
  const [estLeverage, setEstLeverage] = useState<number | null>(null);
  const [estLiquidationPrice, setEstLiquidationPrice] = useState<number | null>(
    null,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FullOrderState, string>>
  >({});

  const updateOrder = (order: Partial<FullOrderState>) => {
    // setEntry((prev) => ({ ...prev, ...order }));
    setEntry(
      // if use {...draft, ...order} will cause extra updated when object it not changed
      produce((draft) => {
        Object.assign(draft, order);
      }),
      // (prev) => ({ ...prev, ...order })
    );
  };

  const updateOrderByKey = <K extends keyof FullOrderState>(
    key: K,
    value: FullOrderState[K],
  ) => {
    setEntry(
      produce((draft) => {
        draft[key] = value;
      }),
    );
  };

  const restoreOrder = (order?: Partial<FullOrderState>) => {
    setEntry(produce((draft) => order as OrderEntryStateEntity));
  };

  const updateOrderComputed = (data: {
    estLeverage: number | null;
    estLiquidationPrice: number | null;
  }) => {
    setEstLeverage(data.estLeverage);
    setEstLiquidationPrice(data.estLiquidationPrice);
  };

  const resetOrder = (order?: Partial<FullOrderState>) => {
    setEntry(
      produce((draft) => ({
        ...draft,
        ...(order ?? initialOrderState),
      })),
    );
  };

  const hasTP_SL = () => {
    return (
      typeof entry.tp_trigger_price !== "undefined" ||
      typeof entry.sl_trigger_price !== "undefined"
    );
  };

  return {
    entry,
    estLeverage,
    estLiquidationPrice,
    errors,
    actions: {
      updateOrder,
      updateOrderByKey,
      restoreOrder,
      updateOrderComputed,
      resetOrder,
      hasTP_SL,
    },
  };
};
