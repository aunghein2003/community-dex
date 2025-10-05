import { useMemo } from "react";
import { API, EMPTY_LIST, SDKError } from "@orderly.network/types";
import { zero } from "@orderly.network/utils";
import { usePrivateQuery } from "../../usePrivateQuery";

type QueryParams = {
  startDate: string;
  endDate: string;
  page?: number;
};

/**
 * Fetch statistics data, only support weekly/monthly/quarterly for now
 */
export const useStatisticsDaily = (
  params: QueryParams,
  options?: {
    ignoreAggregation?: boolean;
  },
) => {
  const { startDate, endDate, page = 1 } = params;
  const { ignoreAggregation = false } = options || {};

  if (!startDate || !endDate) {
    throw new SDKError("Start date and end date are required");
  }

  const getPeriod = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      return 1;
    }
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return diff / (1000 * 60 * 60 * 24);
  };

  const key = useMemo(() => {
    // if (previousPageData && !previousPageData.length) return null;
    const searchParams = new URLSearchParams();

    searchParams.set("page", page.toString());
    searchParams.set(
      "size",
      (getPeriod(startDate, endDate) + (ignoreAggregation ? 0 : 1)).toString(),
    );

    /*
     * add one day for the start date, for ROI calculation
     */
    const modifiedStartDate = new Date(startDate);
    modifiedStartDate.setDate(new Date(startDate).getDate() - 1);

    searchParams.set(
      "start_date",
      modifiedStartDate.toISOString().split("T")[0],
    );
    searchParams.set("end_date", params.endDate);

    return `/v1/client/statistics/daily?${searchParams.toString()}`;
  }, [page, startDate, endDate]);

  const { data } = usePrivateQuery<API.DailyRow[]>(key, {
    formatter: (data) => data.rows.reverse(),
    revalidateOnFocus: false,
  });

  const aggregateValue = useMemo(() => {
    if (ignoreAggregation) {
      return { vol: null, pnl: null, roi: null };
    }
    let vol = zero;
    let pnl = zero;
    let roi = zero;

    if (Array.isArray(data) && data.length) {
      const prevDate = data.shift();
      data.forEach((d) => {
        vol = vol.add(d.perp_volume);
        pnl = pnl.add(d.pnl);
      });

      roi = pnl.div(prevDate!.account_value);
    }

    return { vol: vol.toNumber(), pnl: pnl.toNumber(), roi: roi.toNumber() };
  }, [data]);

  return useMemo(
    () => [data ?? EMPTY_LIST, { aggregateValue: aggregateValue }] as const,
    [data, aggregateValue],
  );
};

export type UseStatisticsDailyReturn = ReturnType<typeof useStatisticsDaily>;
