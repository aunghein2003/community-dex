import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import { AssetHistorySideEnum } from "@orderly.network/types";
import { TabPanel, Tabs } from "@orderly.network/ui";
import { ConvertHistoryWidget } from "../../assets/convertPage/convert.widget";
import { VaultsHistoryWidget } from "../VaultsHistory/transfer.widget";
import { AssetHistoryWidget } from "../assetHistory";
import { DistributionHistoryWidget } from "../distribution";
import { FundingHistoryWidget } from "../funding";
import { TabName } from "./historyDataGroup.script";

export const HistoryDataGroupMobile: React.FC<{
  active?: TabName;
  onTabChange: (tab: string) => void;
}> = (props) => {
  const { active = "deposit", onTabChange } = props;
  const { t } = useTranslation();

  return (
    <Tabs
      value={active}
      onValueChange={onTabChange}
      variant="contained"
      size="lg"
      classNames={{
        tabsList: "oui-px-3 oui-py-2",
        scrollIndicator: "oui-pr-3",
      }}
      showScrollIndicator
    >
      <TabPanel title={t("common.deposits")} value={"deposit"}>
        <AssetHistoryWidget side={AssetHistorySideEnum.DEPOSIT} />
      </TabPanel>
      <TabPanel title={t("common.withdrawals")} value={"withdraw"}>
        <AssetHistoryWidget side={AssetHistorySideEnum.WITHDRAW} />
      </TabPanel>
      <TabPanel title={t("common.funding")} value={"funding"}>
        <FundingHistoryWidget />
      </TabPanel>
      <TabPanel
        title={t("portfolio.overview.distribution")}
        value={"distribution"}
      >
        <DistributionHistoryWidget />
      </TabPanel>
      <TabPanel
        title={t("portfolio.overview.tab.convert.history")}
        value={"convert"}
      >
        <ConvertHistoryWidget />
      </TabPanel>
      <TabPanel title={t("common.vaults")} value={"vaults"}>
        <VaultsHistoryWidget />
      </TabPanel>
    </Tabs>
  );
};
