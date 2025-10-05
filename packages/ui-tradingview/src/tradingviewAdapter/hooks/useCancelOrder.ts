import { useCallback } from "react";
import { useOrderStream } from "@orderly.network/hooks";
import { BracketAlgoType, TpslAlgoType } from "../renderer/tpsl.util";
import { OrderStatus } from "@orderly.network/types";
import { toast } from "@orderly.network/ui";

export default function useCancelOrder() {
  const [
    pendingOrders,
    { cancelOrder, cancelAlgoOrder, cancelTPSLChildOrder},
  ] = useOrderStream({
    status: OrderStatus.INCOMPLETE,
  });
  return useCallback(
    (order: any) => {
      if (order.algo_order_id) {
        if (TpslAlgoType.includes(order.root_algo_order_algo_type)) {
          // check if tpsl active
          const rootOrder = pendingOrders?.find(
            (item) => item.algo_order_id === order.root_algo_order_id
          );
          const isEditActivated = rootOrder.child_orders.every(
            (item: any) => !!item.trigger_price
          );
          if (isEditActivated) {
            return cancelTPSLChildOrder(
              order.algo_order_id,
              order.root_algo_order_id
            );
          }
          return cancelAlgoOrder(rootOrder.algo_order_id, order.symbol).then();
        }
        return cancelAlgoOrder(order.algo_order_id, order.symbol).then();
      }
      return cancelOrder(order.order_id, order.symbol).then();
    },
    [cancelOrder, pendingOrders]
  );
}
