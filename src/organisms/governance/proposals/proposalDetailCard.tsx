import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  PROPOSAL_STATUS,
  PROPOSAL_MESSAGE_TYPE,
  PROPOSAL_MESSAGE_TYPE_PARAMETERCHANGE,
  PROPOSAL_MESSAGE_TYPE_COMMUNITYPOOLSPEND,
  PROPOSAL_MESSAGE_TYPE_SOFTWAREUPGRADE
} from '../../../constants/governance';
import { CHAIN_CONFIG } from '../../../config';
import { convertNumberFormat, convertToFctNumber } from '../../../utils/common';
import { getDateTimeFormat } from '../../../utils/dateUtil';
import { getProposalTypeLabels } from '../../../utils/governance';
import { IProposalDetailState } from '../../../interfaces/governance';
import { IProposalMessageItem } from '../../../interfaces/lcd';

import {
  CardWrapper,
  TitleWrapper,
  ProposalID,
  Title,
  Status,
  ProposalDetailWrapper,
  ProposalDetailItem,
  Label,
  ProposalContent,
  ProposalMainTitle,
  MarkdownContent,
  MessageList,
  MessageItemCard,
  MessageTitle,
  AmountList,
  MsgSendTable,
  MsgSendTh,
  MsgSendTd,
  ExplorerLink
} from './styles';
import { FirmaUtil } from '@firmachain/firma-js';

interface IProps {
  proposalState: IProposalDetailState;
}

interface IProposalAmount {
  denom: string;
  amount: string;
}

interface IMsgSendRow {
  fromAddress: string;
  toAddress: string;
  amounts: IProposalAmount[];
}

interface IParamRow {
  subspace?: string;
  key: string;
  value: any;
}

const ProposalDetailCard = ({ proposalState }: IProps) => {
  const getStatusTypo = (status: string) => {
    const typo = PROPOSAL_STATUS[status] ? PROPOSAL_STATUS[status] : 'UNKNOWN';
    return typo;
  };

  const getProposalTypeTypo = (proposalType: string) => {
    const typo = PROPOSAL_MESSAGE_TYPE[proposalType] ? PROPOSAL_MESSAGE_TYPE[proposalType] : proposalType || 'UNKNOWN';
    return typo;
  };

  const isSpendCommunityPools = (type: string) =>
    getProposalTypeTypo(type) === PROPOSAL_MESSAGE_TYPE_COMMUNITYPOOLSPEND;

  const isChangeParameter = (type: string) => {
    const typeTypo = getProposalTypeTypo(type);
    return typeTypo === PROPOSAL_MESSAGE_TYPE_PARAMETERCHANGE || typeTypo.includes('ParameterChange');
  };

  const isSoftwareUpgrade = (type: string) => getProposalTypeTypo(type) === PROPOSAL_MESSAGE_TYPE_SOFTWAREUPGRADE;
  const isAuthzExec = (type: string) => type === '/cosmos.authz.v1beta1.MsgExec';
  const isBankSend = (type: string) => type === '/cosmos.bank.v1beta1.MsgSend';

  const getTimeFormat = (time: string) => getDateTimeFormat(time);

  const proposalMessages: IProposalMessageItem[] = Array.isArray(proposalState.messages) ? proposalState.messages : [];

  const getCommunityPoolAmounts = (message: IProposalMessageItem): IProposalAmount[] => {
    const amountListFromExtraData = Array.isArray((message.extraData as any)?.amounts)
      ? (message.extraData as any).amounts
      : [];
    if (amountListFromExtraData.length > 0) return amountListFromExtraData;

    const amountListFromRaw = Array.isArray((message.raw as any)?.amount) ? (message.raw as any).amount : [];
    if (amountListFromRaw.length > 0) return amountListFromRaw;

    const singleAmount = (message.extraData as any)?.amount;
    if (singleAmount) {
      return [{ denom: CHAIN_CONFIG.PARAMS.DENOM, amount: singleAmount }];
    }

    return [];
  };

  const getMsgSendRows = (message: IProposalMessageItem): IMsgSendRow[] => {
    if (isBankSend(message.typeRaw)) {
      const sendMessage = message.extraData as any;
      return [
        {
          fromAddress: sendMessage?.fromAddress || '',
          toAddress: sendMessage?.toAddress || '',
          amounts: Array.isArray(sendMessage?.amounts) ? sendMessage.amounts : []
        }
      ];
    }

    const extraDataSends = Array.isArray((message.extraData as any)?.sends) ? (message.extraData as any).sends : [];
    if (extraDataSends.length > 0) return extraDataSends;

    const rawMsgs = Array.isArray((message.raw as any)?.msgs) ? (message.raw as any).msgs : [];
    return rawMsgs
      .filter((msg: any) => msg?.['@type'] === '/cosmos.bank.v1beta1.MsgSend')
      .map((msg: any) => ({
        fromAddress: msg?.from_address || '',
        toAddress: msg?.to_address || '',
        amounts: Array.isArray(msg?.amount) ? msg.amount : []
      }));
  };

  const getDisplayAmountText = (amount: IProposalAmount) => {
    const denom = (amount.denom || CHAIN_CONFIG.PARAMS.DENOM).toLowerCase();
    const isMainDenom = denom === CHAIN_CONFIG.PARAMS.DENOM.toLowerCase();
    const amountValue = convertNumberFormat(convertToFctNumber(amount.amount), 2);
    const amountSymbol = isMainDenom
      ? CHAIN_CONFIG.PARAMS.SYMBOL
      : (amount.denom || CHAIN_CONFIG.PARAMS.DENOM).toUpperCase();

    return `${amountValue} ${amountSymbol}`;
  };

  const renderExplorerAddress = (address?: string) => {
    const normalizedAddress = address || '';
    if (!normalizedAddress) return '-';

    if (!FirmaUtil.isValidAddress(normalizedAddress)) {
      return normalizedAddress;
    }

    return (
      <ExplorerLink
        href={`${CHAIN_CONFIG.EXPLORER_URI}/accounts/${normalizedAddress}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {normalizedAddress}
      </ExplorerLink>
    );
  };

  const getParameterRows = (message: IProposalMessageItem): IParamRow[] => {
    const changes = Array.isArray((message.extraData as any)?.changes) ? (message.extraData as any).changes : [];
    if (changes.length > 0) {
      return changes.map((change: any) => ({
        subspace: change?.subspace || '',
        key: change?.key || '-',
        value: change?.value
      }));
    }

    const params = (message.extraData as any)?.params;
    if (params && typeof params === 'object') {
      return Object.entries(params).map(([key, value]) => ({ key, value }));
    }

    return [];
  };

  const renderParamValue = (key: string, value: any) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '-';
    return JSON.stringify(value);
  };

  return (
    <CardWrapper>
      <ProposalMainTitle>Proposal</ProposalMainTitle>
      <TitleWrapper>
        <ProposalID>#{proposalState.proposalId}</ProposalID>
        <Title>{proposalState.title}</Title>
        <Status>{getStatusTypo(proposalState.status)}</Status>
      </TitleWrapper>
      <ProposalDetailWrapper>
        <ProposalDetailItem>
          <Label>Proposal Type</Label>
          <ProposalContent>{getProposalTypeLabels(proposalState.proposalTypeSummary).join(', ')}</ProposalContent>
        </ProposalDetailItem>
        <ProposalDetailItem>
          <Label>Submit Time</Label>
          <ProposalContent>{getTimeFormat(proposalState.submitTime)}</ProposalContent>
        </ProposalDetailItem>
        <ProposalDetailItem>
          <Label>Description</Label>
          <MarkdownContent>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              skipHtml={true}
              components={{
                a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
              }}
            >
              {proposalState.description || ''}
            </ReactMarkdown>
          </MarkdownContent>
        </ProposalDetailItem>

        {proposalMessages.length > 0 && (
          <ProposalDetailItem>
            <Label>Messages</Label>
            <MessageList>
              {proposalMessages.map((message, index) => {
                const amounts = getCommunityPoolAmounts(message);
                const sendRows = getMsgSendRows(message);
                const paramRows = getParameterRows(message);
                const hasSubspace = paramRows.some((param) => (param.subspace || '').trim().length > 0);

                return (
                  <MessageItemCard key={`${message.typeRaw}-${index}`}>
                    <MessageTitle>{`Message #${index + 1}`}</MessageTitle>

                    <ProposalDetailItem>
                      <Label>Type</Label>
                      <ProposalContent>{message.typeLabel || getProposalTypeTypo(message.typeRaw)}</ProposalContent>
                    </ProposalDetailItem>

                    {isSpendCommunityPools(message.typeRaw) && (
                      <>
                        <ProposalDetailItem>
                          <Label>Recipient</Label>
                          <ProposalContent>
                            {renderExplorerAddress((message.extraData as any)?.recipient)}
                          </ProposalContent>
                        </ProposalDetailItem>
                        <ProposalDetailItem>
                          <Label>Amount</Label>
                          <AmountList>
                            {amounts.length === 0 && <ProposalContent>-</ProposalContent>}
                            {amounts.map((amount: IProposalAmount, amountIndex: number) => (
                              <ProposalContent key={`${amount.denom}-${amountIndex}`}>
                                {getDisplayAmountText(amount)}
                              </ProposalContent>
                            ))}
                          </AmountList>
                        </ProposalDetailItem>
                      </>
                    )}

                    {isChangeParameter(message.typeRaw) && (
                      <ProposalDetailItem>
                        <Label>Change Parameters</Label>
                        <ProposalContent isSmall={true}>
                          <MsgSendTable>
                            <thead>
                              <tr>
                                {hasSubspace && <MsgSendTh>Subspace</MsgSendTh>}
                                <MsgSendTh>Key</MsgSendTh>
                                <MsgSendTh>Value</MsgSendTh>
                              </tr>
                            </thead>
                            <tbody>
                              {paramRows.length === 0 && (
                                <tr>
                                  {hasSubspace && <MsgSendTd>-</MsgSendTd>}
                                  <MsgSendTd>-</MsgSendTd>
                                  <MsgSendTd>-</MsgSendTd>
                                </tr>
                              )}
                              {paramRows.map((param, paramIndex) => (
                                <tr key={`${param.key}-${paramIndex}`}>
                                  {hasSubspace && <MsgSendTd>{param.subspace || '-'}</MsgSendTd>}
                                  <MsgSendTd>{param.key || '-'}</MsgSendTd>
                                  <MsgSendTd>{renderParamValue(param.key, param.value)}</MsgSendTd>
                                </tr>
                              ))}
                            </tbody>
                          </MsgSendTable>
                        </ProposalContent>
                      </ProposalDetailItem>
                    )}

                    {isSoftwareUpgrade(message.typeRaw) && (
                      <>
                        <ProposalDetailItem>
                          <Label>Height</Label>
                          <ProposalContent>{(message.extraData as any)?.height || '-'}</ProposalContent>
                        </ProposalDetailItem>
                        <ProposalDetailItem>
                          <Label>Version</Label>
                          <ProposalContent>{(message.extraData as any)?.name || '-'}</ProposalContent>
                        </ProposalDetailItem>
                        <ProposalDetailItem>
                          <Label>Info</Label>
                          <ProposalContent>{(message.extraData as any)?.info || '-'}</ProposalContent>
                        </ProposalDetailItem>
                      </>
                    )}

                    {(isAuthzExec(message.typeRaw) || isBankSend(message.typeRaw)) && (
                      <>
                        {isAuthzExec(message.typeRaw) && (
                          <ProposalDetailItem>
                            <Label>Grantee</Label>
                            <ProposalContent>
                              {renderExplorerAddress((message.extraData as any)?.grantee)}
                            </ProposalContent>
                          </ProposalDetailItem>
                        )}
                        <ProposalDetailItem>
                          <Label>MsgSend</Label>
                          <ProposalContent>
                            <MsgSendTable>
                              <thead>
                                <tr>
                                  <MsgSendTh>From</MsgSendTh>
                                  <MsgSendTh>To</MsgSendTh>
                                  <MsgSendTh>Amount</MsgSendTh>
                                </tr>
                              </thead>
                              <tbody>
                                {sendRows.length === 0 && (
                                  <tr>
                                    <MsgSendTd>-</MsgSendTd>
                                    <MsgSendTd>-</MsgSendTd>
                                    <MsgSendTd>-</MsgSendTd>
                                  </tr>
                                )}
                                {sendRows.map((send, sendIndex) => (
                                  <tr key={`${send.fromAddress}-${send.toAddress}-${sendIndex}`}>
                                    <MsgSendTd>{renderExplorerAddress(send.fromAddress)}</MsgSendTd>
                                    <MsgSendTd>{renderExplorerAddress(send.toAddress)}</MsgSendTd>
                                    <MsgSendTd>
                                      {send.amounts.length === 0 && '-'}
                                      {send.amounts.length > 0 &&
                                        send.amounts
                                          .map((amount: IProposalAmount) => getDisplayAmountText(amount))
                                          .join(', ')}
                                    </MsgSendTd>
                                  </tr>
                                ))}
                              </tbody>
                            </MsgSendTable>
                          </ProposalContent>
                        </ProposalDetailItem>
                      </>
                    )}
                  </MessageItemCard>
                );
              })}
            </MessageList>
          </ProposalDetailItem>
        )}
      </ProposalDetailWrapper>
    </CardWrapper>
  );
};

export default React.memo(ProposalDetailCard);
