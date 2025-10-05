import { registerSimpleDialog, registerSimpleSheet } from "@orderly.network/ui";
import {
  SharePnLDialogWidget,
  SharePnLBottomSheetWidget,
} from "./sharePnL/sharePnL.widget";
import { i18n } from "@orderly.network/i18n";

const SharePnLDialogId = "sharePnLDialog";
const SharePnLBottomSheetId = "sharePnLBottomSheet";

registerSimpleDialog(SharePnLDialogId, SharePnLDialogWidget, {
  classNames: {
    content: "!oui-max-w-[624px] oui-p-0",
  },
});

registerSimpleSheet(SharePnLBottomSheetId, SharePnLBottomSheetWidget, {
  title: i18n.t("share.pnl.sharePnl"),
  classNames: {
    body: "oui-pb-4 oui-pt-0",
  },
});

export * from "./sharePnL";
export { SharePnLDialogId, SharePnLBottomSheetId };
export type {
  SharePnLConfig,
  SharePnLOptions,
  SharePnLParams,
} from "./types/types";
