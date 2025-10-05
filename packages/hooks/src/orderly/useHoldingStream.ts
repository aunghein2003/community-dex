import { useMemo } from "react";
import useSWRSubscription from "swr/subscription";
import { API } from "@orderly.network/types";
import { getTimestamp } from "@orderly.network/utils";
import { usePrivateQuery } from "../usePrivateQuery";
import { useWS } from "../useWS";

export const useHoldingStream = () => {
  const ws = useWS();

  const { data, isLoading, mutate } = usePrivateQuery<API.Holding[]>(
    "/v1/client/holding",
    {
      formatter: (data) => {
        return data.holding;
      },
    },
  );

  const usdc = useMemo(() => {
    const usdc = data?.find((item) => item.token === "USDC");
    return usdc;
  }, [data]);

  useSWRSubscription("holding", (_, { next }) => {
    const unsubscribe = ws.privateSubscribe(
      {
        id: "balance",
        event: "subscribe",
        topic: "balance",
        ts: getTimestamp(),
      },
      {
        onMessage: (data: any) => {
          const holding = data?.balances ?? ({} as Record<string, any>);

          if (holding) {
            mutate((prevData) => {
              return prevData?.map((item) => {
                const token = holding[item.token];
                if (token) {
                  return {
                    ...item,
                    frozen: token.frozen,
                    holding: token.holding,
                  };
                }
                return item;
              });
            });

            next(holding);
          }
        },
      },
    );

    return () => unsubscribe();
  });

  return {
    data,
    usdc,
    isLoading,
  };
};
