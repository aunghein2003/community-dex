import { FC } from "react";
import { useLocalStorage } from "@orderly.network/hooks";
import { Divider, Flex, Text } from "@orderly.network/ui";
import { useTranslation } from "@orderly.network/i18n";

export const UnrealizedPnLPopoverCard: FC<{}> = (props) => {
  const [unPnlPriceBasis, setUnPnlPriceBasic] = useLocalStorage(
    "unPnlPriceBasis",
    "markPrice"
  );
  const { t } = useTranslation();
  return (
    <Flex
      direction={"column"}
      gap={3}
      className="oui-text-base-contrast-54 oui-items-start"
    >
      <Text>{t("positions.column.unrealPnl.tooltip")}</Text>
      <Divider className="oui-w-full" />
      <div className="oui-mb-0">
        {t("positions.column.unrealPnl.priceBasis")}
      </div>
      <UnPnlPriceBasisCheckBox
        value={unPnlPriceBasis}
        onValueChange={setUnPnlPriceBasic}
      />
    </Flex>
  );
};

const UnPnlPriceBasisCheckBox = (props: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const { value, onValueChange } = props;
  const { t } = useTranslation();

  // "markPrice" | "lastPrice"
  return (
    <Flex gap={2}>
      <RadioButton
        sel={value === "markPrice"}
        label={t("common.markPrice")}
        value={"markPrice"}
        onCheckChange={onValueChange}
      />
      <RadioButton
        sel={value === "lastPrice"}
        label={t("common.lastPrice")}
        value={"lastPrice"}
        onCheckChange={onValueChange}
      />
    </Flex>
  );
};

const RadioButton = (props: {
  sel: boolean;
  label: any;
  value: any;
  onCheckChange: (value: any) => void;
}) => {
  const { sel, label, value, onCheckChange } = props;
  return (
    <Flex
      onClick={(e) => {
        onCheckChange(value);
        e.stopPropagation();
      }}
      gap={1}
      className="oui-cursor-pointer"
    >
      {sel ? <SelIcon /> : <UnselIcon />}
      <Text size="xs" intensity={sel ? 98 : 54}>
        {label}
      </Text>
    </Flex>
  );
};

const SelIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="oui-fill-white"
    >
      <path
        d="M8.01 1.333a6.667 6.667 0 1 0 0 13.333 6.667 6.667 0 0 0 0-13.333m0 1.333a5.334 5.334 0 1 1-.001 10.667 5.334 5.334 0 0 1 0-10.667"
        fill="#fff"
        fillOpacity=".36"
      />
      <circle cx="8" cy="8" r="3.333" />
    </svg>
  );
};

const UnselIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.01 1.333a6.667 6.667 0 1 0 0 13.333 6.667 6.667 0 0 0 0-13.333m0 1.333a5.334 5.334 0 1 1-.001 10.667 5.334 5.334 0 0 1 0-10.667"
        fill="#fff"
        fillOpacity=".54"
      />
    </svg>
  );
};
