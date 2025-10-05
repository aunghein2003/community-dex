import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Flex, Text } from "@orderly.network/ui";
import { FundingRateState } from "./fundingRate.script";

export const FundingRate: FC<FundingRateState> = (props) => {
  const { data, onClick } = props;
  const predFundingRate = data.est_funding_rate;
  const countDown = data.countDown;
  const { t } = useTranslation();
  return (
    <Flex direction={"column"} itemAlign={"start"} pb={2}>
      <Text
        size="2xs"
        intensity={36}
        className="oui-cursor-pointer oui-underline oui-decoration-line-16 oui-decoration-dashed oui-underline-offset-4"
        onClick={onClick}
      >
        {t("trading.fundingRate.predFundingRate")}
      </Text>
      {predFundingRate === null ? (
        "--"
      ) : (
        <div className="orderly-flex orderly-gap-1 oui-text-2xs oui-text-base-contrast-36">
          {/* <span className="orderly-text-warning-darken">{`${predFundingRate}%`}</span> */}
          <Text.numeral coloring suffix="%" dp={4}>
            {predFundingRate ?? "--"}
          </Text.numeral>
          <span>{" in"}</span>
          <span>{" " + countDown}</span>
        </div>
      )}
    </Flex>
  );
};
