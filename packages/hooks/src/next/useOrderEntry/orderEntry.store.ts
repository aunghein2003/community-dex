import {
  OrderlyOrder,
  OrderSide,
  OrderType,
  RequireKeys,
} from "@orderly.network/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type FullOrderState = OrderlyOrder;

type OrderEntryStateEntity = RequireKeys<
  FullOrderState,
  "side" | "order_type" | "symbol"
>;

type OrderEntryState = {
  entry: OrderEntryStateEntity;
  estLeverage: number | null;
  estLiquidationPrice: number | null;
  errors: Partial<Record<keyof FullOrderState, string>>;
};

type OrderEntryActions = {
  updateOrder: (order: Partial<FullOrderState>) => void;
  updateOrderByKey: <K extends keyof FullOrderState>(
    key: K,
    value: FullOrderState[K]
  ) => void;
  restoreOrder: (order?: Partial<FullOrderState>) => void;
  updateOrderComputed: (data: {
    estLeverage: number | null;
    estLiquidationPrice: number | null;
  }) => void;
  resetOrder: (order?: Partial<FullOrderState>) => void;
  hasTP_SL: () => boolean;
};

const initialOrderState = {
  order_price: "",
  order_quantity: "",
  trigger_price: "",
  tp_trigger_price: "",
  sl_trigger_price: "",
  total: "",
  symbol: "",
};

export const useOrderStore = create<
  OrderEntryState & {
    actions: OrderEntryActions;
  }
>()(
  immer((set, get) => ({
    entry: {
      side: OrderSide.BUY,
      order_type: OrderType.LIMIT,
      ...initialOrderState,
    } as OrderEntryStateEntity,
    estLeverage: null,
    estLiquidationPrice: null,
    errors: {},
    actions: {
      hasTP_SL: () => {
        const order = get().entry;
        return (
          typeof order.tp_trigger_price !== "undefined" ||
          typeof order.sl_trigger_price !== "undefined"
        );
      },
      updateOrderComputed: (data: {
        estLeverage: number | null;
        estLiquidationPrice: number | null;
      }) => {
        set(
          (state) => {
            state.estLeverage = data.estLeverage;
            state.estLiquidationPrice = data.estLiquidationPrice;
          },
          false
          // "updateOrderComputed"
        );
      },
      updateOrder: (order: Partial<FullOrderState>) => {
        set(
          (state) => {
            // state.entry[key as keyof BracketOrderEntry] = value;
            state.entry = {
              ...state.entry,
              ...order,
            };
          },
          false
          // "updateOrder"
        );
      },
      updateOrderByKey: <K extends keyof FullOrderState>(
        key: K,
        value: FullOrderState[K]
      ) => {
        set(
          (state) => {
            state.entry[key] = value;
          },
          false
          // "updateOrderByKey"
        );
      },
      restoreOrder: (order) => {
        set(
          (state) => {
            state.entry = order as OrderEntryStateEntity;
          },
          false
          // "restoreOrder"
        );
      },
      resetOrder: (order?: Partial<FullOrderState>) => {
        set(
          (state) => {
            state.entry.order_price = "";
            state.entry.order_quantity = "";
            state.entry.trigger_price = "";
            state.entry.total = "";
            state.entry.tp_trigger_price = "";
            state.entry.tp_pnl = "";
            state.entry.tp_offset = "";
            state.entry.tp_offset_percentage = "";
            state.entry.sl_trigger_price = "";
            state.entry.sl_pnl = "";
            state.entry.sl_offset = "";
            state.entry.sl_offset_percentage = "";
          },
          true
          // "resetOrder"
        );
      },
    },
  }))
);

export const useOrderEntryFromStore = () =>
  useOrderStore((state) => state.entry);
