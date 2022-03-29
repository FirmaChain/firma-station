interface IKeyValue {
  [key: string]: any;
}

const TYPE_COLORS: IKeyValue = {
  zero: "#E8E8E8",
  one: "#2460FA",
  two: "#2BA891",
  three: "#E79720",
  four: "#F17047",
  five: "#DA4B4B",
  six: "#9438DC",
  seven: "#1A869D",
  eight: "#2C9944",
  nine: "#B49F31",
  ten: "#E9A846",
  eleven: "#E94681",
  twelve: "#C15EC4",
  thirteen: "#C388D9",
  fourteen: "#46AEE9",
  fifteen: "#58BC91",
  sixteen: "#90BC58",
  seventeen: "#E99E8E",
  eighteen: "#F0A479",
  nineteen: "#D37763",
  twenty: "#D9C788",
};

const LABELS: IKeyValue = {
  txDelegateLabel: "Delegate",
  txRedelegateLabel: "Redelegate",
  txUndelegateLabel: "Undelegate",
  txCreateValidatorLabel: "Create Validator",
  txEditValidatorLabel: "Edit Validator",
  txSendLabel: "Send",
  txMultisendLabel: "Multisend",
  txVerifyInvariantLabel: "Verify Invariant",
  txFundLabel: "Fund",
  txsetRewardAddressLabel: "Set Reward Address",
  txWithdrawRewardLabel: "Withdraw Reward",
  txDepositLabel: "Deposit",
  txVoteLabel: "Vote",
  txSubmitProposalLabel: "Submit Proposal",
  txUnjailLabel: "Unjail",
  txUnknownLabel: "Unknown",
  txWithdrawCommissionLabel: "Withdraw Commission",
  txSaveProfileLabel: "Save Profile",
  txDeleteProfileLabel: "Delete Profile",
  txCreateRelationshipLabel: "Create Relationship",
  txRequestDTagTransferLabel: "DTag Transfer Request",
  txAcceptDTagTransferLabel: "Accept DTag Transfer",
  txCancelDTagTransferLabel: "Cancel DTag Transfer",
  txRefuseDTagTransferLabel: "Refuse DTag Transfer",
  txBlockUserLabel: "Block User",
  txUnblockUserLabel: "Unblock User",
  txCreateClientLabel: "IBC Create Client",
  txUpdateClientLabel: "IBC Update Client",
  txUpgradeClientLabel: "IBC Upgrade Client",
  txSubmitMisbehaviourLabel: "IBC Submit Misbehaviour",
  txRecvPacketLabel: "IBC Receive Packet",
  txChannelLabel: "IBC Channel",
  txCounterpartyLabel: "IBC Counterparty",
  txPacketLabel: "IBC Packet",
  txAcknowledgementLabel: "IBC Acknowledgement",
  txChannelCloseConfirmLabel: "IBC Channel Close Confirm",
  txChannelCloseInitLabel: "IBC Channel Close Init",
  txChannelOpenAckLabel: "IBC Channel Open Acknowledgement",
  txChannelOpenConfirmLabel: "IBC Channel Open Confirm",
  txChannelOpenInitLabel: "IBC Channel Open Init",
  txChannelOpenTryLabel: "IBC Channel Open Try",
  txTimeoutLabel: "IBC Timeout",
  txTimeoutOnCloseLabel: "IBC Timeout On Close",
  txConnectionOpenAckLabel: "IBC Connection Open Acknowledgement",
  txConnectionOpenConfirmLabel: "IBC Connection Open Confirm",
  txConnectionOpenInitLabel: "IBC Connection Open Init",
  txConnectionOpenTryLabel: "IBC Connection Open Try",
  txConnectionEndLabel: "IBC Connection End",
  txVersionLabel: "IBC Version",
  txTransferLabel: "IBC Transfer",
  txNFTMintLabel: "NFT Mint",
  txNFTTransferLabel: "NFT Transfer",
  txNFTBurnLabel: "NFT Burn",
  txAddContractLogLabel: "Add Contract Log",
  txCreateContractFileLabel: "Create Contract File",
  txFeegrantGrantLabel: "Grant Allowance",
  txFeegrantRevokeLabel: "Revoke Allowance",
  txAuthzGrantLabel: "Grant",
  txTokenCreateLabel: "Token Create",
  txTokenMintLabel: "Token Mint",
  txTokenBurnLabel: "Token Burn",
  txTokenUpdateURILabel: "Token Update",
};

export const TRANSACTION_TYPE_MODEL: IKeyValue = {
  // ========================
  // staking
  // ========================
  "/cosmos.staking.v1beta1.MsgDelegate": {
    tagTheme: TYPE_COLORS["one"],
    tagDisplay: LABELS["txDelegateLabel"],
  },
  "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
    tagTheme: TYPE_COLORS["one"],
    tagDisplay: LABELS["txRedelegateLabel"],
  },
  "/cosmos.staking.v1beta1.MsgUndelegate": {
    tagTheme: TYPE_COLORS["one"],
    tagDisplay: LABELS["txUndelegateLabel"],
  },
  "/cosmos.staking.v1beta1.MsgCreateValidator": {
    tagTheme: TYPE_COLORS["one"],
    tagDisplay: LABELS["txCreateValidatorLabel"],
  },
  "/cosmos.staking.v1beta1.MsgEditValidator": {
    tagTheme: TYPE_COLORS["one"],
    tagDisplay: LABELS["txEditValidatorLabel"],
  },
  // ========================
  // bank
  // ========================
  "/cosmos.bank.v1beta1.MsgSend": {
    tagTheme: TYPE_COLORS["two"],
    tagDisplay: LABELS["txSendLabel"],
  },
  "/cosmos.bank.v1beta1.MsgMultiSend": {
    tagTheme: TYPE_COLORS["two"],
    tagDisplay: LABELS["txMultisendLabel"],
  },
  // ========================
  // crisis
  // ========================
  "/cosmos.crisis.v1beta1.MsgVerifyInvariant": {
    tagTheme: TYPE_COLORS["three"],
    tagDisplay: LABELS["txVerifyInvariantLabel"],
  },
  // ========================
  // slashing
  // ========================
  "/cosmos.slashing.v1beta1.MsgUnjail": {
    tagTheme: TYPE_COLORS["five"],
    tagDisplay: LABELS["txUnjailLabel"],
  },
  // ========================
  // distribution
  // ========================
  "/cosmos.distribution.v1beta1.MsgFundCommunityPool": {
    tagTheme: TYPE_COLORS["six"],
    tagDisplay: LABELS["txFundLabel"],
  },
  "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress": {
    tagTheme: TYPE_COLORS["six"],
    tagDisplay: LABELS["txsetRewardAddressLabel"],
  },
  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward": {
    tagTheme: TYPE_COLORS["six"],
    tagDisplay: LABELS["txWithdrawRewardLabel"],
  },
  "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission": {
    tagTheme: TYPE_COLORS["six"],
    tagDisplay: LABELS["txWithdrawCommissionLabel"],
  },
  // ========================
  // governance
  // ========================
  "/cosmos.gov.v1beta1.MsgDeposit": {
    tagTheme: TYPE_COLORS["seven"],
    tagDisplay: LABELS["txDepositLabel"],
  },
  "/cosmos.gov.v1beta1.MsgVote": {
    tagTheme: TYPE_COLORS["seven"],
    tagDisplay: LABELS["txVoteLabel"],
  },
  "/cosmos.gov.v1beta1.MsgSubmitProposal": {
    tagTheme: TYPE_COLORS["seven"],
    tagDisplay: LABELS["txSubmitProposalLabel"],
  },
  // ========================
  // ibc client
  // ========================
  "/ibc.core.client.v1.MsgCreateClient": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txCreateClientLabel"],
  },
  "/ibc.core.client.v1.MsgUpdateClient": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txUpdateClientLabel"],
  },
  "/ibc.core.client.v1.MsgUpgradeClient": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txUpgradeClientLabel"],
  },
  "/ibc.core.client.v1.MsgSubmitMisbehaviour": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txSubmitMisbehaviourLabel"],
  },
  "/ibc.core.client.v1.Height": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txHeightLabel"],
  },
  // ========================
  // ibc channel
  // ========================
  "/ibc.core.channel.v1.MsgRecvPacket": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txRecvPacketLabel"],
  },
  "/ibc.core.channel.v1.Channel": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txChannelLabel"],
  },
  "/ibc.core.channel.v1.Counterparty": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txCounterpartyLabel"],
  },
  "/ibc.core.channel.v1.Packet": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txPacketLabel"],
  },
  "/ibc.core.channel.v1.MsgAcknowledgement": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txAcknowledgementLabel"],
  },
  "/ibc.core.channel.v1.MsgChannelCloseConfirm": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txChannelCloseConfirmLabel"],
  },
  "/ibc.core.channel.v1.MsgChannelCloseInit": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txChannelCloseInitLabel"],
  },
  "/ibc.core.channel.v1.MsgChannelOpenAck": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txChannelOpenAckLabel"],
  },
  "/ibc.core.channel.v1.MsgChannelOpenConfirm": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txChannelOpenConfirmLabel"],
  },
  "/ibc.core.channel.v1.MsgChannelOpenInit": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txChannelOpenInitLabel"],
  },
  "/ibc.core.channel.v1.MsgChannelOpenTry": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txChannelOpenTryLabel"],
  },
  "/ibc.core.channel.v1.MsgTimeout": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txTimeoutLabel"],
  },
  "/ibc.core.channel.v1.MsgTimeoutOnClose": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txTimeoutOnCloseLabel"],
  },
  // ========================
  // ibc connection
  // ========================
  "/ibc.core.connection.v1.MsgConnectionOpenAck": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txConnectionOpenAckLabel"],
  },
  "/ibc.core.connection.v1.MsgConnectionOpenConfirm": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txConnectionOpenConfirmLabel"],
  },
  "/ibc.core.connection.v1.MsgConnectionOpenInit": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txConnectionOpenInitLabel"],
  },
  "/ibc.core.connection.v1.MsgConnectionOpenTry": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txConnectionOpenTryLabel"],
  },
  "/ibc.core.connection.v1.ConnectionEnd": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txConnectionEndLabel"],
  },
  "/ibc.core.connection.v1.Counterparty": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txCounterpartyLabel"],
  },
  "/ibc.core.connection.v1.Version": {
    tagTheme: TYPE_COLORS["nine"],
    tagDisplay: LABELS["txVersionLabel"],
  },
  // ========================
  // ibc transfer
  // ========================
  "/ibc.applications.transfer.v1.MsgTransfer": {
    tagTheme: TYPE_COLORS["ten"],
    tagDisplay: LABELS["txTransferLabel"],
  },

  // ========================
  // firmachain transfer
  // ========================
  "/firmachain.firmachain.nft.MsgMint": {
    tagTheme: TYPE_COLORS["four"],
    tagDisplay: LABELS["txNFTMintLabel"],
  },
  "/firmachain.firmachain.nft.MsgTransfer": {
    tagTheme: TYPE_COLORS["four"],
    tagDisplay: LABELS["txNFTTransferLabel"],
  },
  "/firmachain.firmachain.nft.MsgBurn": {
    tagTheme: TYPE_COLORS["four"],
    tagDisplay: LABELS["txNFTBurnLabel"],
  },
  "/firmachain.firmachain.contract.MsgAddContractLog": {
    tagTheme: TYPE_COLORS["four"],
    tagDisplay: LABELS["txAddContractLogLabel"],
  },
  "/firmachain.firmachain.contract.MsgCreateContractFile": {
    tagTheme: TYPE_COLORS["four"],
    tagDisplay: LABELS["txCreateContractFileLabel"],
  },
  "/cosmos.feegrant.v1beta1.MsgGrantAllowance": {
    tagTheme: TYPE_COLORS["two"],
    tagDisplay: LABELS["txFeegrantGrantLabel"],
  },
  "/cosmos.feegrant.v1beta1.MsgRevokeAllowance": {
    tagTheme: TYPE_COLORS["three"],
    tagDisplay: LABELS["txFeegrantRevokeLabel"],
  },
  "/cosmos.authz.v1beta1.MsgGrant": {
    tagTheme: TYPE_COLORS["two"],
    tagDisplay: LABELS["txAuthzGrantLabel"],
  },
  "/firmachain.firmachain.token.MsgCreateToken": {
    tagTheme: TYPE_COLORS["two"],
    tagDisplay: LABELS["txTokenCreateLabel"],
  },
  "/firmachain.firmachain.token.MsgMint": {
    tagTheme: TYPE_COLORS["two"],
    tagDisplay: LABELS["txTokenMintLabel"],
  },
  "/firmachain.firmachain.token.MsgBurn": {
    tagTheme: TYPE_COLORS["four"],
    tagDisplay: LABELS["txTokenBurnLabel"],
  },
  "/firmachain.firmachain.token.MsgUpdateTokenURI": {
    tagTheme: TYPE_COLORS["three"],
    tagDisplay: LABELS["txTokenUpdateURILabel"],
  },
};
