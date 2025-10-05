import { FC } from "react";
import { Flex, Text } from "@orderly.network/ui";
import { API } from "@orderly.network/types";
import { commifyOptional } from "@orderly.network/utils";
import { useTranslation } from "@orderly.network/i18n";

export const Price: FC<API.LiquidationPositionByPerp> = (props) => {
  // const { quote_dp } = useSymbolContext();
  const { t } = useTranslation();

  return (
    <Flex width={"100%"} justify={"between"}>
      <Flex gap={1}>
        <Text size="2xs" intensity={36}>
          {t("common.price")}
        </Text>
        <Text size="2xs" intensity={20}>
          (USDC)
        </Text>
      </Flex>
      {/* <Text.numeral size="2xs" intensity={80} dp={quote_dp} padding={false}>
        {props.transfer_price}
      </Text.numeral> */}
      <Text size="2xs" intensity={80}>
        {commifyOptional(props.transfer_price)}
      </Text>
    </Flex>
  );
};
export const Quantity: FC<API.LiquidationPositionByPerp> = (props) => {
  // const { quote_dp } = useSymbolContext();
  const { t } = useTranslation();

  return (
    <Flex width={"100%"} justify={"between"}>
      <Text size="2xs" intensity={36}>
        {t("common.quantity")}
      </Text>
      {/* <Text.numeral size="2xs" intensity={80} dp={quote_dp} padding={false}>
        {props.position_qty}
      </Text.numeral> */}
      <Text size="2xs" intensity={80}>
        {commifyOptional(props.position_qty)}
      </Text>
    </Flex>
  );
};
export const LiquidationFee: FC<API.LiquidationPositionByPerp> = (props) => {
  // const { quote_dp } = useSymbolContext();
  const { t } = useTranslation();
  return (
    <Flex width={"100%"} justify={"between"}>
      <Text size="2xs" intensity={36}>
        {t("positions.Liquidation.column.liquidationFee")}
      </Text>
      {/* <Text.numeral size="2xs" intensity={80} dp={quote_dp} padding={false}>
        {props.abs_liquidation_fee}
      </Text.numeral>  */}
      <Text size="2xs" intensity={80}>
        {commifyOptional(props.abs_liquidation_fee)}
      </Text>
    </Flex>
  );
};
