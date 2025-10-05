import { useMemo } from "react";
import { useQuery } from "@orderly.network/hooks";

export const useFundingFeeHistory = () => {
  const { isLoading, data } = useQuery(`/v1/funding_fee/history`);

  console.log(data, isLoading);

  return {
    history: data,
  };
};
