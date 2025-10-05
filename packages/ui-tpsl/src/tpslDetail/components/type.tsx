import { findTPSLFromOrder } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { API } from "@orderly.network/types";
import { Flex, Text } from "@orderly.network/ui";
import { FlexCell } from "../components/common";

export const TypeRender = ({ order }: { order: API.AlgoOrder }) => {
  const { tp_trigger_price, sl_trigger_price } = findTPSLFromOrder(order);
  const { t } = useTranslation();

  return (
    <Flex
      direction={"column"}
      justify={"between"}
      itemAlign={"start"}
      className="oui-text-2xs"
    >
      {tp_trigger_price && (
        <FlexCell>
          <Text className="oui-text-trade-profit">{t("tpsl.tp")}</Text>
        </FlexCell>
      )}

      {sl_trigger_price && (
        <FlexCell>
          <Text className="oui-text-trade-loss">{t("tpsl.sl")}</Text>
        </FlexCell>
      )}
    </Flex>
  );
};
