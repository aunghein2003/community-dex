import {
  AlgoOrderRootType,
  AlgoOrderType,
  API,
  OrderStatus,
  SDKError,
  WSMessage,
} from "@orderly.network/types";
import { OrderType } from "@orderly.network/types";
import { object2underscore } from "../../utils/ws";
import { BaseMergeHandler } from "./baseMergeHandler";

export type AlgoOrderFieldChanges = Partial<
  Record<OrderType, Partial<Record<keyof API.AlgoOrder, boolean>>>
>;

export class AlgoOrderMergeHandler extends BaseMergeHandler<
  WSMessage.AlgoOrder[],
  API.AlgoOrder
> {
  get orderId(): number {
    return this.data.algo_order_id;
  }

  get status(): string {
    return this.data.root_algo_status;
  }

  //   merge(
  //     key: string,
  //     message: WSMessage.AlgoOrder[],
  //     prevData: API.OrderResponse[]
  //   ): API.OrderResponse[] | undefined {
  //     switch (this.status) {
  //       case "TRIGGER": {
  //       }
  //       default:
  //         return super.merge(key, message, prevData);
  //     }
  //   }

  pre(
    message: WSMessage.AlgoOrder[],
    prevData?: API.OrderResponse[],
  ): API.AlgoOrder {
    return AlgoOrderMergeHandler.groupOrders(message);
  }

  isFullFilled(): boolean {
    if (
      "total_executed_quantity" in this.data &&
      this.data.total_executed_quantity !== 0
    ) {
      return this.data.total_executed_quantity === this.data.quantity;
    } else if (
      "total_executed_quantity" in (this.data as API.AlgoOrder).child_orders[0]
    ) {
      return (
        (this.data as API.AlgoOrder).child_orders[0].total_executed_quantity ===
        (this.data as API.AlgoOrder).child_orders[0].quantity
      );
    }

    return false;
  }

  static groupOrders(orders: WSMessage.AlgoOrder[]): API.AlgoOrder {
    const rootOrderIndex = orders.findIndex(
      (order) =>
        order.parentAlgoOrderId === 0 &&
        order.algoOrderId === order.rootAlgoOrderId,
    );
    if (rootOrderIndex === -1) {
      throw new SDKError("Root order not found");
    }

    const rootOrder_ = object2underscore(
      orders[rootOrderIndex],
    ) as unknown as API.AlgoOrder;

    rootOrder_.child_orders = orders
      .filter((_, index) => index !== rootOrderIndex)
      .map((order) => {
        return object2underscore(order) as unknown as API.AlgoOrder;
      });

    if (
      rootOrder_.algo_type === "BRACKET" &&
      rootOrder_.child_orders.length > 0
    ) {
      // @ts-ignore
      const childOrders = this.groupBracketChildOrders([
        ...rootOrder_.child_orders,
      ]);
      rootOrder_.child_orders = [childOrders];
    }

    return rootOrder_;
  }

  static groupBracketChildOrders(orders: WSMessage.AlgoOrder[]): API.AlgoOrder {
    const innerOrders = [...orders];
    const rootOrderIndex = innerOrders.findIndex(
      (order) =>
        order.algoType !== AlgoOrderType.STOP_LOSS &&
        order.algoType !== AlgoOrderType.TAKE_PROFIT,
    );
    if (rootOrderIndex === -1) {
      throw new SDKError("Root order not found");
    }

    const rootOrder = innerOrders.splice(
      rootOrderIndex,
      1,
    )[0] as unknown as API.AlgoOrder;
    rootOrder.child_orders = innerOrders as unknown as API.AlgoOrder[];
    return rootOrder;
  }

  /**
   * get the field changes compared to the previous data
   * now only record the field changes for trailing stop REPLACED status order
   */
  getFieldChanges(prevData?: API.OrderResponse[]) {
    const {
      algo_order_id,
      algo_type,
      algo_status,
      is_activated,
      extreme_price,
    } = this.data || {};

    const fieldChanges: AlgoOrderFieldChanges = {};
    if (
      algo_type === AlgoOrderRootType.TRAILING_STOP &&
      algo_status === OrderStatus.REPLACED &&
      prevData?.length
    ) {
      for (const item of prevData) {
        const algoOrders = item.rows as API.AlgoOrder[];
        for (const order of algoOrders) {
          if (order.algo_order_id === algo_order_id) {
            fieldChanges[AlgoOrderRootType.TRAILING_STOP] = {
              extreme_price: order.extreme_price !== extreme_price,
              is_activated: order.is_activated !== is_activated,
            };

            return fieldChanges;
          }
        }
      }
    }

    return fieldChanges;
  }
}
