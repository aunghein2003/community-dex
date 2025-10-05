import { Flex, Text } from "@orderly.network/ui";
import { JumpIcon } from "../components/jumpIcon";
import { FC } from "react";
import { EsOrderlyIcon } from "../components/esOrderlyIcon";
import { OrderlyIcon } from "../components/orderlyIcon";
import { AvailableReturns } from "./availableToClaim.script";
import { commifyOptional } from "@orderly.network/utils";
import { useTranslation } from "@orderly.network/i18n";

export const AvailableToClaim: FC<AvailableReturns> = (props) => {
  const { t } = useTranslation();

  return (
    <Flex
      id="oui-tradingRewards-home-availableToClaim"
      p={6}
      r="2xl"
      direction={"column"}
      gap={4}
      width={"100%"}
      className=" oui-font-semibold oui-bg-base-9 "
    >
      <Flex direction={"row"} justify={"between"} width={"100%"}>
        <Text className="oui-text-lg">
          {t("tradingRewards.availableClaim")}
        </Text>
        <Flex
          direction={"row"}
          gap={1}
          onClick={props.goToClaim}
          className="oui-cursor-pointer oui-text-primary-light"
        >
          <Text size="sm">{t("tradingRewards.claim")}</Text>
          <JumpIcon />
        </Flex>
      </Flex>
      <Flex direction={"row"} gap={3} width={"100%"}>
        <Statics title="ORDER" value={props.order} />
        <Statics title="esORDER" value={props.esOrder} isEsOrder />
      </Flex>
    </Flex>
  );
};
// background: linear-gradient(28.29deg, #1B1D22 21.6%, #26292E 83.23%);

const Statics: FC<{
  title: string;
  isEsOrder?: boolean;
  value?: number;
}> = (props) => {
  const { value } = props;
  return (
    <Flex
      className="oui-flex-1 oui-bg-base-8 oui-py-[11px]"
      direction={"column"}
      gap={2}
      r="xl"
      gradient="neutral"
      angle={180}
      border
      borderColor={6}
    >
      <Text className="oui-text-xs xl:oui-text-sm oui-text-base-contrast-54">
        {props.title}
      </Text>
      <Flex direction={"row"} gap={1}>
        {props.isEsOrder ? <EsOrderlyIcon /> : <OrderlyIcon />}
        <Text
          className="oui-text-sm xl:oui-text-base"
          children={commifyOptional(value, { fix: 2 })}
        />
      </Flex>
    </Flex>
  );
};
