export const positions = {
  "positions.positionHistory": "Position history",
  "positions.liquidation": "Liquidation",
  "positions.closePosition": "Close Position",

  "positions.column.liqPrice": "Liq. price",
  "positions.column.liqPrice.tooltip":
    "Estimated price at which your position will be liquidated. Prices are estimated and depend on multiple factors across all positions.",
  "positions.column.unrealPnl.tooltip":
    "Current unrealized profit or loss on your open positions across all widgets calculated using Mark Price.",
  "positions.column.unrealPnl.priceBasis": "Unrealized PnL Price Basis",
  "positions.column.margin": "Margin",
  "positions.column.margin.tooltip":
    "The minimum equity to keep your position.",
  "positions.column.margin.formula":
    "Margin = Position size * Mark price * MMR",
  "positions.column.close": "Close",

  "positions.limitClose": "Limit close",
  "positions.limitClose.description":
    "You agree closing {{quantity}} {{base}} position at limit price.",
  "positions.marketClose": "Market close",
  "positions.marketClose.description":
    "You agree closing {{quantity}} {{base}} position at market price.",
  "positions.limitClose.errors.exceed.title": "Close size limit exceeded",
  "positions.limitClose.errors.exceed.description":
    "Cannot close {{quantity}} {{symbol}} position. Max allowed per close is {{maxQuantity}} {{symbol}}.",

  "positions.history.status.closed": "Closed",
  "positions.history.status.partialClosed": "Partially closed",
  "positions.history.type.adl": "Adl",
  "positions.history.type.liquidated": "Liquidated",
  "positions.history.liquidated.liquidationId": "Liquidation id",
  "positions.history.liquidated.liquidatorFee": "Liquidator fee",
  "positions.history.liquidated.insFundFee": "Ins. Fund fee",

  "positions.history.column.closed": "Closed",
  "positions.history.column.maxClosed": "Max closed",
  "positions.history.column.closed&maxClosed": "Closed / Max closed",
  "positions.history.column.netPnl": "Net PnL",
  "positions.history.column.timeOpened": "Time opened",
  "positions.history.column.timeClosed": "Time closed",
  "positions.history.column.updatedTime": "Updated time",
  "positions.history.netPnl.tradingFee": "Trading fee",

  "positions.Liquidation.column.liquidationId": "Liquidation id",
  "positions.Liquidation.column.insFundTransfer": "Ins. fund transfer",
  "positions.Liquidation.column.liquidationFee": "Liquidation fee",
  "positions.Liquidation.column.liquidationFeeRate": "Liquidation fee rate",
  "positions.Liquidation.column.markPrice": "Liq. mark price",

  "positions.Liquidation.tooltip.liquidation":
    "An account is subject to liquidation if its Account Margin Ratio falls below its Maintenance Margin Ratio.",
  "positions.Liquidation.tooltip.viewMore": "View more",
  "positions.Liquidation.col.tooltip.feeRate":
    "The percentage charged for this liquidation, covering both the liquidator’s fee and the insurance fund contribution. This rate varies by symbol.",
  "positions.Liquidation.col.tooltip.fee":
    "The total fee charged for this liquidation, including both the liquidator’s fee and the insurance fund contribution.",

  "positions.Liquidation.expand.label.mr": "Margin ratio",
  "positions.Liquidation.expand.label.mmr": "Maint. margin ratio",
  "positions.Liquidation.expand.label.collateral": "Collateral value",
  "positions.Liquidation.expand.label.notional": "Position notional",
  "positions.Liquidation.expand.tooltip.mr":
    "The ratio of collateral to position size at the time of liquidation.",
  "positions.Liquidation.expand.tooltip.mmr":
    "The minimum margin required to keep the position open.",
  "positions.Liquidation.expand.tooltip.collateral":
    "Total collateral value in the account when liquidation occurred.",
  "positions.Liquidation.expand.tooltip.notional":
    "The total notional value of positions in the account at liquidation.",
};

export type Positions = typeof positions;
