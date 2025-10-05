import { useMemo } from "react";
import { account as accountPerp } from "@orderly.network/perp";
import { API } from "@orderly.network/types";
import { Decimal } from "@orderly.network/utils";
import { useIndexPricesStream } from "../orderly/useIndexPricesStream";
import { useTokenInfo } from "../orderly/useTokensInfo/tokensInfo.store";

const { maxWithdrawalUSDC, maxWithdrawalOtherCollateral, collateralRatio } =
  accountPerp;

/**
 * The max withdrawal amount for the token
 * if token is not provided, return the max withdrawal amount for USDC
 */
export function useSubAccountMaxWithdrawal(options: {
  token?: string;
  unsettledPnL?: number;
  freeCollateral: Decimal;
  holdings?: API.Holding[];
}) {
  const { token, unsettledPnL, freeCollateral, holdings } = options;

  const tokenInfo = useTokenInfo(token!);

  const { data: indexPrices } = useIndexPricesStream();

  const usdc = useMemo(() => {
    const usdc = holdings?.find((item) => item.token === "USDC");
    return usdc;
  }, [holdings]);

  const holding = useMemo(() => {
    return holdings?.find((item) => item?.token === token);
  }, [holdings, token]);

  const usdcBalance = usdc?.holding ?? 0;

  const indexPrice = useMemo(() => {
    if (token === "USDC") {
      return 1;
    }
    const symbol = `PERP_${token}_USDC`;
    return indexPrices[symbol] ?? 0;
  }, [token, indexPrices]);

  const memoizedCollateralRatio = useMemo(() => {
    const { base_weight = 0, discount_factor = 0 } = tokenInfo || {};
    const holdingQty = holding?.holding ?? 0;
    return collateralRatio({
      baseWeight: base_weight,
      discountFactor: discount_factor,
      collateralQty: holdingQty,
      collateralCap: tokenInfo?.user_max_qty ?? holdingQty,
      indexPrice,
    });
  }, [holdings, tokenInfo, indexPrice, token, holding]);

  const maxAmount = useMemo(() => {
    if (token === "USDC") {
      return maxWithdrawalUSDC({
        USDCBalance: usdcBalance,
        freeCollateral,
        upnl: unsettledPnL ?? 0,
      });
    }
    return maxWithdrawalOtherCollateral({
      USDCBalance: usdcBalance,
      collateralQty: holding?.holding ?? 0,
      freeCollateral,
      indexPrice,
      weight: memoizedCollateralRatio,
    }).toNumber();
  }, [
    usdcBalance,
    freeCollateral,
    unsettledPnL,
    memoizedCollateralRatio,
    indexPrice,
    token,
    holding,
  ]);

  return maxAmount;
}
