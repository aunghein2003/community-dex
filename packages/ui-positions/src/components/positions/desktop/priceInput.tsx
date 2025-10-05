import { useTranslation } from "@orderly.network/i18n";
import { OrderType } from "@orderly.network/types";
import {
  CaretDownIcon,
  cn,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Input,
  inputFormatter,
} from "@orderly.network/ui";
import { usePositionsRowContext } from "../positionsRowContext";

export const PriceInput = () => {
  const { type, quoteDp, price, updatePriceChange, updateOrderType } =
    usePositionsRowContext();
  const { t } = useTranslation();

  return (
    <DropdownMenuRoot>
      <Input
        size="sm"
        value={
          type === OrderType.LIMIT ? price : t("orderEntry.orderType.market")
        }
        onValueChange={(e) => updatePriceChange(e)}
        formatters={[
          inputFormatter.numberFormatter,
          ...(quoteDp ? [inputFormatter.dpFormatter(quoteDp)] : []),
        ]}
        onFocus={() => {
          if (type === OrderType.MARKET) {
            updateOrderType(OrderType.LIMIT);
          }
        }}
        suffix={
          <DropdownMenuTrigger asChild>
            <button className="oui-h-full oui-px-1">
              <CaretDownIcon size={12} color="white" />
            </button>
          </DropdownMenuTrigger>
        }
        classNames={{
          root: cn(
            "oui-border oui-border-solid oui-border-white/[0.12] oui-outline-none focus-within:oui-outline-primary-light",
          ),
        }}
      />
      <DropdownMenuContent
        align="end"
        className="oui-w-[96px] oui-min-w-[96px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            size="xs"
            onSelect={() => {
              updateOrderType(OrderType.MARKET);
            }}
          >
            <span>{t("common.marketPrice")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
