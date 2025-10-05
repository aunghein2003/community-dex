import { MouseEventHandler, useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Flex, Text, Box, Tooltip, Column } from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import {
  FavoritesIcon,
  MoveToTopIcon,
  OrderlyIcon,
  UnFavoritesIcon,
} from "../../icons";
import { FavoriteInstance } from "../../type";
import { FavoritesDropdownMenuWidget } from "../favoritesDropdownMenu";

export const useMarketsListFullColumns = (
  favorite: FavoriteInstance,
  isFavoriteList = false,
) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    return [
      {
        title: <UnFavoritesIcon className="oui-mt-1" />,
        dataIndex: "isFavorite",
        align: "center",
        width: 30,
        render: (value, record) => {
          const onDelSymbol: MouseEventHandler = (e) => {
            favorite.updateSymbolFavoriteState(
              record,
              favorite.selectedFavoriteTab,
              true,
            );
            e.stopPropagation();
          };

          const button = (
            <Flex
              width="100%"
              height="100%"
              mr={3}
              justify="center"
              itemAlign="center"
              onClick={isFavoriteList ? onDelSymbol : undefined}
              data-testid="oui-testid-markets-table-row-favorite-icon"
            >
              {value ? (
                <FavoritesIcon className="oui-text-[rgba(255,154,46,1)]" />
              ) : (
                <UnFavoritesIcon className="oui-text-base-contrast-36 hover:oui-text-[rgba(255,154,46,1)]" />
              )}
            </Flex>
          );

          if (isFavoriteList) {
            return button;
          }

          return (
            <FavoritesDropdownMenuWidget row={record} favorite={favorite}>
              {button}
            </FavoritesDropdownMenuWidget>
          );
        },
      },
      {
        title: t("markets.column.market"),
        dataIndex: "symbol",
        width: 90,
        onSort: true,
        render: (value) => {
          return (
            <Text.formatted
              rule="symbol"
              formatString="base-type"
              size="xs"
              weight="semibold"
              showIcon
            >
              {value}
            </Text.formatted>
          );
        },
      },
      {
        title: t("common.price"),
        dataIndex: "24h_close",
        width: 100,
        align: "right",
        onSort: true,
        render: (value, record) => {
          return (
            <Text.numeral dp={record.quote_dp || 2} currency="$">
              {value}
            </Text.numeral>
          );
        },
      },
      {
        title: t("markets.column.24hChange"),
        dataIndex: "change",
        width: 100,
        align: "right",
        onSort: true,
        render: (value) => {
          return (
            <Text.numeral
              rule="percentages"
              coloring
              rm={Decimal.ROUND_DOWN}
              showIdentifier
            >
              {value}
            </Text.numeral>
          );
        },
      },
      {
        title: (
          <Flex gapX={1}>
            <OrderlyIcon /> {t("markets.column.24hVolume")}
          </Flex>
        ),
        dataIndex: "24h_amount",
        width: 100,
        align: "right",
        onSort: true,
        render: (value) => {
          return (
            <Text.numeral currency="$" dp={0} rm={Decimal.ROUND_DOWN}>
              {value}
            </Text.numeral>
          );
        },
      },
      {
        title: (
          <Flex gapX={1}>
            <OrderlyIcon /> {t("markets.openInterest")}
          </Flex>
        ),
        dataIndex: "openInterest",
        width: 100,
        align: "right",
        onSort: true,
        render: (value) => {
          return (
            <Text.numeral currency="$" dp={0} rm={Decimal.ROUND_DOWN}>
              {value}
            </Text.numeral>
          );
        },
      },
      {
        title: t("markets.dataList.column.8hFunding"),
        dataIndex: "8h_funding",
        width: 100,
        align: "right",
        onSort: true,
        render: (value) => {
          if (value === null) {
            return "--";
          }
          return (
            <Text.numeral
              rule="percentages"
              coloring
              dp={4}
              rm={Decimal.ROUND_DOWN}
              showIdentifier
            >
              {value}
            </Text.numeral>
          );
        },
      },
      {
        dataIndex: "action",
        type: "action",
        width: 40,
        render: (value, record) => {
          if (isFavoriteList) {
            return (
              <Flex justify="end" mr={4}>
                <Tooltip
                  content={t("markets.dataList.column.moveTop")}
                  align="center"
                  delayDuration={0}
                >
                  <Box
                    className="oui-hidden oui-cursor-pointer group-hover:oui-block"
                    onClick={(e) => {
                      e.stopPropagation();
                      favorite.pinToTop(record);
                    }}
                    data-testid="oui-markets-favorites-pinned-icon"
                  >
                    <MoveToTopIcon className="oui-text-base-contrast-20 hover:oui-text-base-contrast" />
                  </Box>
                </Tooltip>
              </Flex>
            );
          }
          return null;
        },
      },
    ] as Column[];
  }, [favorite, isFavoriteList, t]);

  return columns;
};
