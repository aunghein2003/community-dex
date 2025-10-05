import { ChartPosition, OrderInterface } from "../type";
import { getOrderId } from "./order.util";
import {
  buildQuantityTpslNoMap,
  formatPnl,
  getTpslEstPnl,
  isActivatedTpslOrder,
} from "./tpsl.util";

export class TpslCalService {
  private quantityTpslNoMap: Map<number, number>;
  private tpslPnlMap: Map<number, string>;
  private positions: ChartPosition[] | null;

  constructor() {
    this.quantityTpslNoMap = new Map();
    this.tpslPnlMap = new Map();
    this.positions = null;
  }

  getQuantityTpslNoMap() {
    return this.quantityTpslNoMap;
  }

  getTpslPnlMap() {
    return this.tpslPnlMap;
  }

  getFormattedEstPnl(tpslOrder: OrderInterface) {
    if (this.positions === null) {
      return "";
    }

    const position = this.positions[0];

    if (!position) {
      return "";
    }

    const { estPnl } = getTpslEstPnl(tpslOrder, position);

    return formatPnl(estPnl);
  }

  prepareTpslPnlMap(newPendingOrders: OrderInterface[]) {
    const changed: number[] = [];

    newPendingOrders.forEach((order) => {
      const orderId = getOrderId(order);

      if (orderId && isActivatedTpslOrder(order)) {
        const prevPnl = this.tpslPnlMap.get(orderId);
        const newPnl = this.getFormattedEstPnl(order);
        if (prevPnl !== newPnl) {
          changed.push(orderId);
          // @ts-ignore
          this.tpslPnlMap.set(orderId, newPnl);
        }
      }
    });

    return changed;
  }

  prepareQuantityTpslNoMap(newPendingOrders: OrderInterface[]) {
    this.quantityTpslNoMap = buildQuantityTpslNoMap(newPendingOrders);
  }

  recalculatePnl(
    positions: ChartPosition[] | null,
    pendingOrders: OrderInterface[]
  ) {
    this.positions = positions;

    return this.prepareTpslPnlMap(pendingOrders);
  }

  clear() {
    this.positions = null;
    this.quantityTpslNoMap.clear();
    this.tpslPnlMap.clear();
  }
}
