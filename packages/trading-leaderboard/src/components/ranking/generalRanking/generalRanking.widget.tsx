import { FC } from "react";
import { Ranking, RankingProps } from "../shared/ranking.ui";
import {
  GeneralRankingScriptOptions,
  useGeneralRankingScript,
} from "./generalRanking.script";

export type GeneralRankingWidgetProps = Pick<
  RankingProps,
  "style" | "className" | "fields"
> &
  GeneralRankingScriptOptions;

export const GeneralRankingWidget: FC<GeneralRankingWidgetProps> = (props) => {
  const { dateRange, address, fields, sortKey, ...rest } = props;
  const state = useGeneralRankingScript({
    dateRange,
    address,
    sortKey,
  });

  return <Ranking {...state} {...rest} fields={fields} />;
};
