import { FC } from "react";
import { RefferalAPI as API } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Flex,
  Text,
  TraderMobileIcon,
  ChevronRightIcon,
  cn,
} from "@orderly.network/ui";
import { RouterAdapter } from "@orderly.network/ui-scaffold";
import { commifyOptional } from "@orderly.network/utils";

const isNumber = (val: unknown): val is number => {
  return typeof val === "number" && !Number.isNaN(val);
};

type TraderCardMobileProps = {
  referralInfo?: API.ReferralInfo;
  routerAdapter?: RouterAdapter;
};

export const TraderCardMobile: FC<TraderCardMobileProps> = (props) => {
  const { t } = useTranslation();
  const { referralInfo, routerAdapter } = props;
  const rebate = referralInfo?.referee_info?.["30d_referee_rebate"];
  return (
    <Flex
      className="
        oui-via-21.6% 
        oui-via-83.23% 
        oui-relative 
        oui-h-[112px] 
        oui-w-full 
        oui-flex-col 
        oui-items-start 
        oui-rounded-xl 
        oui-border
        oui-border-solid 
        oui-border-[rgba(var(--oui-gradient-success-start)/0.36)]
        oui-bg-gradient-to-r
        oui-from-[rgba(var(--oui-gradient-success-end)/0.12)]
        oui-to-[rgba(var(--oui-gradient-success-start)/0.12)]
        oui-p-3
      "
    >
      <Flex className="oui-w-full oui-flex-row oui-justify-between oui-items-center">
        <Flex className="oui-flex-col oui-items-start">
          <Text className="oui-text-base-contrast oui-text-base oui-font-semibold">
            {t("affiliate.trader.rebates")}
          </Text>
          <Text className="oui-text-2xs oui-font-normal oui-text-base-contrast-54">
            {t("affiliate.trader.tradingRebates")}
          </Text>
        </Flex>
        <TraderMobileIcon />
      </Flex>

      <Flex
        className={cn(
          "oui-mt-auto oui-w-full oui-flex-row oui-items-center oui-gap-1",
        )}
      >
        <img
          src="https://oss.orderly.network/static/symbol_logo/USDC.png"
          alt="USDC"
          className="oui-size-5"
        />
        <Text
          className={cn(
            "oui-text-xs oui-font-semibold",
            isNumber(rebate) && rebate !== 0
              ? "oui-text-base-contrast"
              : "oui-text-base-contrast-36",
          )}
        >
          {commifyOptional(rebate, { fix: 2, fallback: "--" })}
        </Text>
        <Text className="oui-text-xs oui-font-semibold oui-text-base-contrast-36">
          (30D)
        </Text>
        <ChevronRightIcon
          size={18}
          color="white"
          className="oui-ml-auto"
          onClick={() => {
            routerAdapter?.onRouteChange({
              href: "/rewards/affiliate?tab=trader",
              name: t("tradingRewards.rewards"),
            });
          }}
        />
      </Flex>
    </Flex>
  );
};
