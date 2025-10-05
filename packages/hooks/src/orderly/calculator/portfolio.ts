import { pathOr } from "ramda";
import { account } from "@orderly.network/perp";
import { API, EMPTY_LIST } from "@orderly.network/types";
import { Decimal } from "@orderly.network/utils";
import { CalculatorCtx, CalculatorScope } from "../../types";
import { createGetter } from "../../utils/createGetter";
import { parseHolding } from "../../utils/parseHolding";
import { Portfolio, useAppStore } from "../appStore";
import { BaseCalculator } from "./baseCalculator";
import { IndexPriceCalculatorName } from "./indexPrice";
import { MarketCalculatorName } from "./markPrice";

export const PortfolioCalculatorName = "portfolio";

class PortfolioCalculator extends BaseCalculator<any> {
  name = PortfolioCalculatorName;

  calc(scope: CalculatorScope, data: any, ctx: CalculatorCtx) {
    let markPrices: Record<PropertyKey, number>;
    let indexPrices: Record<PropertyKey, number>;
    const portfolio = this.getPortfolio(ctx);

    if (scope === CalculatorScope.MARK_PRICE) {
      markPrices = data;
    } else {
      markPrices = ctx.get<Record<string, number>>(
        (cache) => cache[MarketCalculatorName],
      );
    }

    if (scope === CalculatorScope.INDEX_PRICE) {
      indexPrices = data;
    } else {
      indexPrices = ctx.get<Record<string, number>>(
        (cache) => cache[IndexPriceCalculatorName],
      );
    }

    // if (scope === CalculatorScope.POSITION) {
    //   positions = data;
    // } else {
    const positions = ctx.get<API.PositionsTPSLExt>(
      (output: Record<string, any>) => output.positionCalculator_all,
    );
    // }

    let holding = portfolio.holding;

    if (
      scope === CalculatorScope.PORTFOLIO &&
      data.holding &&
      Array.isArray(holding)
    ) {
      if (Array.isArray(data.holding)) {
        holding = data.holding;
      } else {
        holding = holding.map((item) => {
          if (data.holding[item.token]) {
            return {
              ...item,
              holding: data.holding[item.token].holding,
              frozen: data.holding[item.token].frozen,
            };
          }

          return item;
        });
      }
    }

    const accountInfo = ctx.accountInfo!;
    const symbolsInfo = ctx.symbolsInfo!;
    const tokensInfo = ctx.tokensInfo;

    return this.format({
      holding,
      positions,
      markPrices,
      accountInfo,
      symbolsInfo,
      indexPrices: indexPrices,
      tokensInfo: tokensInfo ?? EMPTY_LIST,
    });
  }

  private getPortfolio(ctx: CalculatorCtx) {
    return (
      ctx.get<Portfolio>((output) => output[this.name]) ||
      useAppStore.getState().portfolio
    );
  }

  private format(inputs: {
    holding?: API.Holding[] | ReadonlyArray<API.Holding>;
    positions: API.PositionsTPSLExt;
    markPrices: Record<string, number> | null;
    indexPrices: Record<string, number> | null;
    accountInfo: API.AccountInfo;
    symbolsInfo: Record<string, API.SymbolExt>;
    tokensInfo: API.Chain[] | ReadonlyArray<API.Chain>;
  }) {
    const {
      holding,
      positions,
      markPrices,
      indexPrices,
      accountInfo,
      symbolsInfo,
      tokensInfo,
    } = inputs;

    if (
      !holding ||
      !positions ||
      !Array.isArray(positions.rows) ||
      !markPrices ||
      !indexPrices ||
      !accountInfo
    ) {
      return null;
    }

    const unsettledPnL = pathOr(0, ["total_unsettled_pnl"])(positions);
    const unrealizedPnL = pathOr(0, ["total_unreal_pnl"])(positions);

    const [USDC_holding, nonUSDC] = parseHolding(
      holding,
      indexPrices,
      tokensInfo,
    );

    const usdc = holding.find((item) => item.token === "USDC");

    const totalCollateral = account.totalCollateral({
      USDCHolding: USDC_holding,
      nonUSDCHolding: nonUSDC,
      unsettlementPnL: unsettledPnL,
    });

    const totalValue = account.totalValue({
      totalUnsettlementPnL: unsettledPnL,
      USDCHolding: USDC_holding,
      nonUSDCHolding: nonUSDC,
    });

    const totalUnrealizedROI = account.totalUnrealizedROI({
      totalUnrealizedPnL: unrealizedPnL,
      totalValue: totalValue.toNumber(),
    });

    const totalInitialMarginWithOrders = account.totalInitialMarginWithQty({
      positions: positions.rows,
      markPrices,
      IMR_Factors: accountInfo.imr_factor,
      maxLeverage: accountInfo.max_leverage,
      symbolInfo: createGetter({ ...symbolsInfo }),
    });

    const freeCollateral = account.freeCollateral({
      totalCollateral,
      totalInitialMarginWithOrders,
    });

    const availableBalance = account.availableBalance({
      USDCHolding: usdc?.holding ?? 0,
      unsettlementPnL: positions.total_unsettled_pnl ?? 0,
    });

    return {
      totalCollateral,
      totalValue,
      totalUnrealizedROI,
      freeCollateral,
      availableBalance,
      unsettledPnL,
      holding,
    };
  }

  update(
    data: { [K in keyof Portfolio]: number | Decimal } | null,
    scope: CalculatorScope,
  ) {
    if (data) {
      useAppStore.getState().actions.batchUpdateForPortfolio({
        totalCollateral: data.totalCollateral as Decimal,
        totalValue: data.totalValue as Decimal,
        freeCollateral: data.freeCollateral as Decimal,
        availableBalance: data.availableBalance as number,
        totalUnrealizedROI: data.totalUnrealizedROI as number,
        unsettledPnL: data.unsettledPnL as number,
        holding: Array.isArray(data.holding)
          ? (data.holding as API.Holding[])
          : [],
      });
    }
  }
}

export { PortfolioCalculator };
