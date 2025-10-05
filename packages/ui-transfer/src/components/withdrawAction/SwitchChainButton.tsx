import { Button, ButtonProps, Flex, modal, toast } from "@orderly.network/ui";
import { ChainSelectorDialogId } from "@orderly.network/ui-chain-selector";
import { NetworkId } from "@orderly.network/types";
import { useTranslation } from "@orderly.network/i18n";
interface IProps {
  networkId?: NetworkId;
  size: ButtonProps["size"];
}

export default function SwitchChainButton(props: IProps) {
  const { t } = useTranslation();

  const switchChain = () => {
    modal
      .show<{
        wrongNetwork: boolean;
      }>(ChainSelectorDialogId, {
        networkId: props.networkId,
        bridgeLessOnly: true,
      })
      .then(
        (r) => {
          toast.success(t("connector.networkSwitched"));
        },
        (error) => console.log("[switchChain error]", error)
      );
  };

  return (
    <Flex direction={"column"}>
      <Button
        color="warning"
        size={props.size}
        fullWidth
        onClick={() => {
          switchChain();
        }}
      >
        {t("connector.switchNetwork")}
      </Button>
    </Flex>
  );
}
