import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Button, SimpleDialog, Text } from "@orderly.network/ui";
import { CancelBtnState } from "./cancelBtn.script";

export const CancelBtn: FC<CancelBtnState> = (props) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="outlined"
      fullWidth
      color="secondary"
      size="sm"
      className="oui-border-base-contrast-36"
      onClick={(e) => props.onCancel(e)}
    >
      {t("common.cancel")}
    </Button>
  );
};
