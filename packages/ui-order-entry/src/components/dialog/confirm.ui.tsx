import { FC, ReactNode, useMemo } from "react";
import { useLocalStorage } from "@orderly.network/hooks";
import { usePositionStream } from "@orderly.network/hooks";
import { i18n, useTranslation } from "@orderly.network/i18n";
import {
  BBOOrderType,
  API,
  OrderSide,
  OrderType,
  PositionType,
} from "@orderly.network/types";
import { OrderlyOrder } from "@orderly.network/types";
import {
  Badge,
  Button,
  Checkbox,
  cn,
  Divider,
  Flex,
  Grid,
  registerSimpleDialog,
  Text,
  textVariants,
} from "@orderly.network/ui";
import { Decimal, getBBOType } from "@orderly.network/utils";
import { isBBOOrder } from "../../utils";

type OrderConfirmDialogProps = {
  order: OrderlyOrder;
  symbolInfo: API.SymbolExt;
  onConfirm: () => void;
  onCancel: () => void;
};

export const OrderConfirmDialog = (props: OrderConfirmDialogProps) => {
  const { symbolInfo, order, onConfirm, onCancel } = props;
  const { quote, quote_dp, base_dp } = symbolInfo;
  const { side, order_type, order_type_ext, level, symbol } = order;
  const { t } = useTranslation();
  const [{ rows: positions }] = usePositionStream(symbol);
  const position = positions?.[0];
  const positionQty = position?.position_qty;

  const [_, setNeedConfirm] = useLocalStorage("orderly_order_confirm", true);

  const renderPositionType = () => {
    if (order.position_type === PositionType.FULL) {
      return <Text>{t("tpsl.positionType.full")}</Text>;
    }
    return <Text>{t("tpsl.positionType.partial")}</Text>;
  };

  const renderPrice = () => {
    if (
      order_type === OrderType.MARKET ||
      order_type === OrderType.STOP_MARKET
    ) {
      return <Text intensity={80}>{t("common.marketPrice")}</Text>;
    }

    if (isBBOOrder({ order_type, order_type_ext })) {
      const bboType = getBBOType({
        type: order_type_ext!,
        side,
        level,
      });
      const label = {
        [BBOOrderType.COUNTERPARTY1]: t("orderEntry.bbo.counterparty1"),
        [BBOOrderType.COUNTERPARTY5]: t("orderEntry.bbo.counterparty5"),
        [BBOOrderType.QUEUE1]: t("orderEntry.bbo.queue1"),
        [BBOOrderType.QUEUE5]: t("orderEntry.bbo.queue5"),
      }[bboType!];

      return <Text intensity={80}>{label}</Text>;
    }

    return (
      <Text.numeral
        unit={quote}
        rule="price"
        className="oui-text-base-contrast"
        unitClassName="oui-text-base-contrast-36 oui-ml-1"
        dp={quote_dp}
        padding={false}
      >
        {order.order_price}
      </Text.numeral>
    );
  };

  const renderTPSLPrice = ({
    price,
    isOrderPrice,
    isEnable,
    colorType,
  }: {
    price: string;
    isOrderPrice?: boolean;
    isEnable?: boolean;
    colorType: "TP" | "SL";
  }) => {
    if (!isEnable) {
      return <Text className="oui-text-base-contrast-36">-- USDC</Text>;
    }
    if (!price) {
      if (isOrderPrice) {
        return (
          <Text className="oui-text-base-contrast-36">
            {t("common.marketPrice")}
          </Text>
        );
      }
    }
    return (
      <Text.numeral
        unit={"USDC"}
        rule={"price"}
        className={cn(
          "oui-text-base-contrast",
          colorType === "TP" ? "oui-text-trade-profit" : "oui-text-trade-loss",
        )}
        unitClassName={"oui-text-base-contrast-36 oui-ml-1"}
        dp={quote_dp}
        padding={false}
      >
        {price}
      </Text.numeral>
    );
  };

  const renderTPSLQty = () => {
    if (!positionQty || !order.order_quantity) {
      return null;
    }
    let qty = new Decimal(order.order_quantity);
    if (order.position_type === PositionType.FULL) {
      qty = qty.plus(new Decimal(positionQty ?? 0));
    }
    return (
      <Flex justify={"between"}>
        <Text>
          {order.position_type === PositionType.FULL
            ? t("common.positionQty")
            : t("common.orderQty")}
        </Text>
        <Text.numeral
          rule={"price"}
          dp={base_dp}
          padding={false}
          className="oui-text-base-contrast"
        >
          {qty.toNumber()}
        </Text.numeral>
      </Flex>
    );
  };

  const renderPriceAndTotal = () => {
    if (order_type === OrderType.TRAILING_STOP) {
      const { activated_price, callback_value, callback_rate } = order;

      const callbackView = callback_rate ? (
        <Flex justify={"between"}>
          <Text>{t("orderEntry.trailingRate")}</Text>
          <Text className="oui-text-base-contrast">{callback_rate}%</Text>
        </Flex>
      ) : (
        <OrderItem
          title={t("orderEntry.trailingValue")}
          value={callback_value!}
          unit={quote}
          dp={quote_dp}
        />
      );
      return (
        <>
          {activated_price && (
            <OrderItem
              title={t("common.triggerPrice")}
              value={activated_price!}
              unit={quote}
              dp={quote_dp}
            />
          )}
          {callbackView}
        </>
      );
    }

    return (
      <>
        <Flex justify={"between"}>
          <Text>{t("common.price")}</Text>
          {renderPrice()}
        </Flex>
        <OrderItem
          title={t("common.estTotal")}
          value={order.total}
          unit={quote}
          dp={quote_dp}
        />
      </>
    );
  };

  const header = (
    <Flex justify={"between"}>
      <Text.formatted rule={"symbol"} showIcon>
        {order.symbol}
      </Text.formatted>
      <Flex justify={"end"} gapX={1}>
        <OrderTypeTag type={order_type} />
        {side === OrderSide.BUY ? (
          <Badge color={"buy"} size={"sm"}>
            {t("common.buy")}
          </Badge>
        ) : (
          <Badge color={"sell"} size={"sm"}>
            {t("common.sell")}
          </Badge>
        )}
      </Flex>
    </Flex>
  );

  const quantityItem = (
    <Flex justify={"between"}>
      <Text>{t("common.orderQty")}</Text>
      <Text.numeral
        rule={"price"}
        dp={base_dp}
        padding={false}
        className="oui-text-base-contrast"
      >
        {order.order_quantity}
      </Text.numeral>
    </Flex>
  );

  const triggerPriceItem = (order_type === OrderType.STOP_LIMIT ||
    (order_type === OrderType.STOP_MARKET && order.trigger_price)) && (
    <OrderItem
      title={t("common.trigger")}
      value={order.trigger_price}
      unit={quote}
      dp={quote_dp}
    />
  );

  const tpslTriggerPrice = (order.tp_trigger_price ||
    order.sl_trigger_price) && (
    <>
      <Divider className="oui-my-4" />
      <div
        className={textVariants({
          size: "sm",
          intensity: 54,
          className: "oui-space-y-1 oui-w-full oui-flex oui-flex-col oui-gap-3",
        })}
      >
        <Text className="oui-text-base-contrast">{renderPositionType()}</Text>
        {renderTPSLQty()}

        <Flex
          direction={"column"}
          justify={"between"}
          itemAlign={"start"}
          gap={1}
          className="oui-w-full"
        >
          <Flex justify={"between"} className="oui-w-full">
            <Text>{t("tpsl.tpTriggerPrice")}</Text>
            {renderTPSLPrice({
              price: order.tp_trigger_price ?? "",
              isOrderPrice: false,
              isEnable: !!order.tp_trigger_price,
              colorType: "TP",
            })}
          </Flex>
          <Flex justify={"between"} className="oui-w-full">
            <Text>{t("tpsl.tpOrderPrice")}</Text>
            {renderTPSLPrice({
              price: order.tp_order_price ?? "",
              isOrderPrice: true,
              isEnable: !!order.tp_trigger_price,
              colorType: "TP",
            })}
          </Flex>
        </Flex>

        <Flex
          direction={"column"}
          justify={"between"}
          itemAlign={"start"}
          gap={1}
          className="oui-w-full"
        >
          <Flex justify={"between"} className="oui-w-full">
            <Text>{t("tpsl.slTriggerPrice")}</Text>
            {renderTPSLPrice({
              price: order.sl_trigger_price ?? "",
              isOrderPrice: false,
              isEnable: !!order.sl_trigger_price,
              colorType: "SL",
            })}
          </Flex>
          <Flex justify={"between"} className="oui-w-full">
            <Text>{t("tpsl.slOrderPrice")}</Text>
            {renderTPSLPrice({
              price: order.sl_order_price ?? "",
              isOrderPrice: true,
              isEnable: !!order.sl_trigger_price,
              colorType: "SL",
            })}
          </Flex>
        </Flex>
      </div>
    </>
  );

  const orderConfirmCheckbox = (
    <Flex gapX={1} pt={4} pb={5}>
      <Checkbox
        id="orderConfirm"
        color={"white"}
        onCheckedChange={(checked) => {
          setNeedConfirm(!!!checked);
        }}
      />
      <label
        htmlFor="orderConfirm"
        className={textVariants({
          size: "xs",
          intensity: 54,
        })}
      >
        {t("orderEntry.disableOrderConfirm")}
      </label>
    </Flex>
  );

  const buttons = (
    <Grid cols={2} gapX={3}>
      <Button color={"secondary"} size={"md"} onClick={() => onCancel()}>
        {t("common.cancel")}
      </Button>
      <Button size={"md"} onClick={() => onConfirm()}>
        {t("common.confirm")}
      </Button>
    </Grid>
  );

  return (
    <>
      {header}
      <Divider className="oui-my-4" />

      <div
        className={textVariants({
          size: "sm",
          intensity: 54,
          className: "oui-space-y-1",
        })}
      >
        {quantityItem}
        {triggerPriceItem}

        {renderPriceAndTotal()}
      </div>

      {tpslTriggerPrice}

      {orderConfirmCheckbox}

      {buttons}
    </>
  );
};

type OrderItemProps = {
  title: ReactNode;
  value: string;
  unit: string;
  dp: number;
};

const OrderItem: FC<OrderItemProps> = (props) => {
  const { title, value, unit, dp } = props;
  return (
    <Flex justify="between">
      <Text>{title}</Text>
      <Text.numeral
        unit={unit}
        rule="price"
        dp={dp}
        padding={false}
        className="oui-text-base-contrast"
        unitClassName="oui-text-base-contrast-36 oui-ml-1"
      >
        {value}
      </Text.numeral>
    </Flex>
  );
};

OrderConfirmDialog.displayName = "OrderConfirmDialog";

const OrderTypeTag = (props: { type: OrderType }) => {
  const { t } = useTranslation();
  const typeStr = useMemo(() => {
    switch (props.type) {
      case OrderType.LIMIT:
        return t("orderEntry.orderType.limit");
      case OrderType.MARKET:
        return t("common.marketPrice");
      case OrderType.STOP_LIMIT:
        return t("orderEntry.orderType.stopLimit");
      case OrderType.STOP_MARKET:
        return t("orderEntry.orderType.stopMarket");
      case OrderType.TRAILING_STOP:
        return t("orderEntry.orderType.trailingStop");
      default:
        return "";
    }
  }, [props.type]);

  return (
    <Badge color={"neutral"} size={"sm"}>
      {typeStr}
    </Badge>
  );
};

const Dialog = (
  props: Omit<OrderConfirmDialogProps, "onCancel" | "onConfirm"> & {
    close: () => void;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  },
) => {
  const { close, resolve, reject, ...rest } = props;

  return (
    <OrderConfirmDialog
      {...rest}
      onCancel={() => {
        reject();
        close();
      }}
      onConfirm={() => {
        resolve();
        close();
      }}
    />
  );
};

export const orderConfirmDialogId = "orderConfirm";

registerSimpleDialog(orderConfirmDialogId, Dialog, {
  size: "sm",
  title: () => i18n.t("orderEntry.orderConfirm"),
});
