import { ReactNode } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  ExclamationFillIcon,
  Flex,
  modal,
  Text,
  Tooltip,
} from "@orderly.network/ui";
import { RefreshIcon } from "../../icons";

type UnsettlePnlInfoProps = {
  hasPositions: boolean;
  unsettledPnl?: number;
  onSettlePnl: () => Promise<any>;
  tooltipContent?: ReactNode;
  dialogContent?: ReactNode;
};

export const UnsettlePnlInfo = (props: UnsettlePnlInfoProps) => {
  const {
    hasPositions,
    unsettledPnl,
    onSettlePnl,
    tooltipContent,
    dialogContent,
  } = props;
  const { t } = useTranslation();

  if (unsettledPnl === 0 && !hasPositions) {
    return <></>;
  }

  const settlePnlDialog = () => {
    modal.confirm({
      title: t("settle.settlePnl"),
      content: dialogContent,
      onOk: () => {
        return onSettlePnl();
      },
    });
  };

  return (
    <Flex justify="between" className="oui-text-2xs oui-text-base-contrast-36">
      <Flex itemAlign="center" justify="start" gap={1}>
        <Tooltip
          className="oui-max-w-[274px] oui-font-semibold"
          content={tooltipContent as any}
        >
          <Flex itemAlign="center" justify="start" gap={1}>
            <ExclamationFillIcon
              size={14}
              className="oui-text-warning-darken"
            />
            <Text className="oui-cursor-pointer oui-border-b oui-border-dashed oui-border-line-12">
              {`${t("settle.unsettled")}:`}
            </Text>
          </Flex>
        </Tooltip>
        <Text.numeral
          showIdentifier
          coloring
          weight="semibold"
          dp={6}
          data-testid="oui-testid-withdraw-dialog-unsettledPnl-value"
        >
          {unsettledPnl}
        </Text.numeral>
        <Text>USDC</Text>
      </Flex>
      <Flex itemAlign="center" gap={1} className="oui-cursor-pointer">
        <RefreshIcon className="oui-text-primary" />
        <Text
          data-testid="oui-testid-withdraw-dialog-settle-text"
          size="2xs"
          color="primary"
          className=" oui-select-none"
          onClick={settlePnlDialog}
        >
          {t("common.settle")}
        </Text>
      </Flex>
    </Flex>
  );
};
