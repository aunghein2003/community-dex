import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Flex,
  Text,
  SettingFillIcon,
  ChevronRightIcon,
} from "@orderly.network/ui";
import { RouterAdapter } from "@orderly.network/ui-scaffold";
import { PortfolioLeftSidebarPath } from "../../../layout";

type Props = {
  routerAdapter?: RouterAdapter;
};

export const SettingRouterMobile: FC<Props> = (props) => {
  const { t } = useTranslation();
  return (
    <Flex
      direction={"row"}
      width={"100%"}
      className="oui-cursor-pointer oui-items-center oui-gap-2 oui-rounded-xl oui-bg-base-9 oui-p-4 oui-mb-3"
      onClick={() =>
        props?.routerAdapter?.onRouteChange({
          href: PortfolioLeftSidebarPath.Setting,
          name: t("portfolio.setting"),
        })
      }
    >
      <SettingFillIcon size={18} opacity={0.98} color="white" />
      <Text className="oui-text-base oui-font-semibold oui-text-base-contrast-80">
        {t("portfolio.setting")}
      </Text>
      <ChevronRightIcon
        className="oui-ml-auto"
        size={18}
        opacity={0.36}
        color="white"
      />
    </Flex>
  );
};
