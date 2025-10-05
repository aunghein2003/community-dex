import type {
  AddOrderlyKeyInputs,
  RegisterAccountInputs,
  SettleInputs,
  SignatureDomain,
  WithdrawInputs,
  DexRequestInputs,
  InternalTransferInputs,
} from "@orderly.network/core";
import { DEFAUL_ORDERLY_KEY_SCOPE, definedTypes } from "@orderly.network/types";

export async function withdrawMessage(
  inputs: WithdrawInputs & {
    domain: SignatureDomain;
    chainId: number;
  },
) {
  const { chainId, receiver, token, amount, nonce, brokerId, domain } = inputs;
  // const domain = getDomain(chainId,true);

  const primaryType = "Withdraw";
  const timestamp = Date.now();

  const typeDefinition = {
    EIP712Domain: definedTypes.EIP712Domain,
    [primaryType]: definedTypes[primaryType],
  };

  const message = {
    brokerId,
    chainId,
    receiver,
    token,
    amount,
    timestamp,
    withdrawNonce: nonce,
  };

  const toSignatureMessage = {
    domain,
    message,
    primaryType,
    types: typeDefinition,
  };

  return [message, toSignatureMessage] as const;
}

export async function internalTransferMessage(
  inputs: InternalTransferInputs & {
    domain: SignatureDomain;
    chainId: number;
  },
) {
  const { chainId, receiver, token, amount, nonce, domain } = inputs;

  const primaryType = "InternalTransfer";

  const typeDefinition = {
    EIP712Domain: definedTypes.EIP712Domain,
    [primaryType]: definedTypes[primaryType],
  };

  const message = {
    chainId,
    receiver,
    token,
    amount,
    transferNonce: nonce,
  };

  const toSignatureMessage = {
    domain,
    message,
    primaryType,
    types: typeDefinition,
  };

  return [message, toSignatureMessage] as const;
}

export async function addOrderlyKeyMessage(
  inputs: AddOrderlyKeyInputs & {
    domain: SignatureDomain;
    chainId: number;
    // chainType: ChainType;
  },
) {
  const {
    publicKey,
    chainId,
    // primaryType,
    brokerId,
    expiration = 365,
    timestamp = Date.now(),
    scope,
    tag,
    domain,
    subAccountId,
  } = inputs;
  // const now = Date.now();
  // message;
  // const chainId = this.chainId;
  const primaryType = "AddOrderlyKey";
  const message = {
    brokerId,
    orderlyKey: publicKey,
    scope: scope || DEFAUL_ORDERLY_KEY_SCOPE,
    chainId,
    timestamp,
    // chainType,
    expiration: timestamp + 1000 * 60 * 60 * 24 * expiration,
    ...(typeof tag !== "undefined" ? { tag } : {}),
    ...(typeof subAccountId !== "undefined" ? { subAccountId } : {}),
  };

  const typeDefinition = {
    EIP712Domain: definedTypes.EIP712Domain,
    [primaryType]: definedTypes[primaryType],
  };

  const toSignatureMessage = {
    domain,
    message,
    primaryType,
    types: typeDefinition,
  };

  return [message, toSignatureMessage] as const;
}

/**
 * generate `registerAccount` data and to be signed message structure
 */

export async function registerAccountMessage(
  inputs: RegisterAccountInputs & {
    domain: SignatureDomain;
    chainId: number;
  },
) {
  const { chainId, domain, registrationNonce, brokerId, timestamp } = inputs;
  // const chainId = this.chainId;
  // const now = Date.now();
  const primaryType = "Registration";
  const message = {
    brokerId,
    chainId,
    timestamp,
    registrationNonce,
  };

  const typeDefinition = {
    EIP712Domain: definedTypes.EIP712Domain,
    [primaryType]: definedTypes[primaryType],
  };

  const toSignatureMessage = {
    domain,
    message,
    primaryType,
    types: typeDefinition,
  };

  return [message, toSignatureMessage] as const;
}

export async function settleMessage(
  inputs: SettleInputs & {
    domain: SignatureDomain;
    chainId: number;
  },
) {
  const { settlePnlNonce, brokerId, chainId, timestamp, domain } = inputs;

  const primaryType = "SettlePnl";

  const typeDefinition = {
    EIP712Domain: definedTypes.EIP712Domain,
    [primaryType]: definedTypes[primaryType],
  };

  const message = {
    brokerId,
    chainId: chainId,
    timestamp: timestamp,
    settleNonce: settlePnlNonce,
  };

  const toSignatureMessage = {
    domain,
    message,
    primaryType,
    types: typeDefinition,
  };

  return [message, toSignatureMessage] as const;
}

export async function dexRequestMessage(
  inputs: DexRequestInputs & {
    domain: SignatureDomain;
    chainId: number;
  },
) {
  const {
    payloadType,
    nonce,
    receiver,
    amount,
    vaultId,
    token,
    dexBrokerId,
    domain,
  } = inputs;

  const primaryType = "DexRequest";

  const typeDefinition = {
    EIP712Domain: definedTypes.EIP712Domain,
    [primaryType]: definedTypes[primaryType],
  };

  const message = {
    payloadType,
    nonce,
    receiver,
    amount,
    vaultId,
    token,
    dexBrokerId,
  };

  const toSignatureMessage = {
    domain,
    message,
    primaryType,
    types: typeDefinition,
  };

  return [message, toSignatureMessage] as const;
}
