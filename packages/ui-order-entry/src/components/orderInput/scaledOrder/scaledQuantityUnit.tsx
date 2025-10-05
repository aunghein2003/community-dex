import { FC, useMemo } from "react";
import { Select, Text, cn } from "@orderly.network/ui";

export type QuantityUnitProps = {
  base: string;
  quote: string;
  value: string;
  onValueChange: (value: string) => void;
};

const valueRenderer = (value: string) => {
  return (
    <Text size="2xs" intensity={36}>
      {value}
    </Text>
  );
};

export const ScaledQuantityUnit: FC<QuantityUnitProps> = (props) => {
  const { base, quote } = props;

  const options = useMemo(() => {
    return [{ name: quote }, { name: base }];
  }, [base, quote]);

  return (
    <Select.tokens
      variant="text"
      size="xs"
      iconSize="2xs"
      tokens={options}
      classNames={{
        trigger: cn(
          "oui-absolute oui-right-0 oui-top-1",
          "oui-w-full oui-justify-end",
        ),
      }}
      value={props.value}
      onValueChange={props.onValueChange}
      valueFormatter={valueRenderer}
      contentProps={{
        align: "end",
        alignOffset: -1,
        sideOffset: -4,
        className: "oui-border oui-border-line-6",
      }}
    />
  );
};
