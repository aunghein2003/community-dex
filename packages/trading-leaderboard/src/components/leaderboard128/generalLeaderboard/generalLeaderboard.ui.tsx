import { FC, useMemo } from "react";
import { cn, Box, useScreen, Divider } from "@orderly.network/ui";
import { LeaderboardTab } from "../../../type";
import { GeneralRankingWidget } from "../../ranking128/generalRanking";
import { RankingColumnFields } from "../../ranking128/shared/column";
import { LeaderboardFilter } from "../shared/LeaderboardFilter";
import { LeaderboardTabs } from "../shared/LeaderboardTabs";
import { GeneralLeaderboardIScriptReturn } from "./generalLeaderboard.script";

export type GeneralLeaderboardIProps = {
  style?: React.CSSProperties;
  className?: string;
  campaignDateRange?: {
    start_time: Date | string;
    end_time: Date | string;
  };
  weekOneAddresses?: string[];
} & GeneralLeaderboardIScriptReturn;

export const GeneralLeaderboardI: FC<GeneralLeaderboardIProps> = (props) => {
  const { isMobile } = useScreen();

  const fields = useMemo<RankingColumnFields[]>(() => {
    if (isMobile) {
      return [
        "rank",
        "address",
        props.activeTab === LeaderboardTab.Volume ? "volume" : "pnl",
      ];
    }
    return ["rank", "address", "volume", "pnl"];
  }, [isMobile, props.activeTab]);

  if (isMobile) {
    return (
      <Box
        pt={2}
        px={3}
        r="2xl"
        intensity={900}
        width="100%"
        className={cn(
          "oui-trading-leaderboard-general-leaderboard oui-relative",
          props.className,
        )}
        style={props.style}
      >
        <LeaderboardFilter {...props} />
        <LeaderboardTabs
          isMobile={isMobile}
          className="oui-pt-0"
          activeTab={props.activeTab}
          onTabChange={props.onTabChange}
        />

        <GeneralRankingWidget
          weekOneAddresses={props.weekOneAddresses}
          dateRange={props.dateRange}
          address={props.searchValue}
          sortKey={
            props.activeTab === LeaderboardTab.Volume
              ? "perp_volume"
              : "realized_pnl"
          }
          fields={fields}
        />
      </Box>
    );
  }

  return (
    <Box
      pt={2}
      pb={6}
      px={6}
      r="2xl"
      intensity={900}
      className={cn(
        "oui-trading-leaderboard-general-leaderboard oui-relative",
        "oui-mx-auto oui-max-w-[992px]",
        props.className,
      )}
      style={props.style}
    >
      <LeaderboardFilter {...props} />
      <Divider intensity={8} />

      <GeneralRankingWidget
        weekOneAddresses={props.weekOneAddresses}
        dateRange={props.dateRange}
        address={props.searchValue}
        fields={fields}
      />
    </Box>
  );
};
