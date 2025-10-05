import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Button,
  cn,
  EmptyStateIcon,
  Flex,
  PlusIcon,
  Text,
} from "@orderly.network/ui";

type FavoritesEmptyProps = {
  className?: string;
  onClick: () => void;
};

export const FavoritesEmpty: FC<FavoritesEmptyProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Flex
      direction="column"
      itemAlign="center"
      gapY={4}
      className={cn("oui-text-center", props.className)}
    >
      <EmptyStateIcon />
      <Button
        color="gray"
        size="xs"
        className="oui-bg-base-4"
        onClick={props.onClick}
      >
        <PlusIcon
          className="oui-mr-1 oui-text-base-contrast"
          opacity={1}
          size={12}
        />
        <Text intensity={98}>{t("markets.favorites.addFavorites")}</Text>
      </Button>
    </Flex>
  );
};
