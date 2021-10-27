import React from "react";
import moment from "moment";
import numeral from "numeral";

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
} from "./styles";

import {
  PROPOSAL_STATUS,
  PROPOSAL_MESSAGE_TYPE,
  PROPOSAL_MESSAGE_TYPE_PARAMETERCHANGE,
  PROPOSAL_MESSAGE_TYPE_COMMUNITYPOOLSPEND,
  PROPOSAL_MESSAGE_TYPE_SOFTWAREUPGRADE,
} from "constants/government";

const ProposalDetailCard = ({ proposalState }) => {
  const getStatusTypo = (status) => {
    const typo = PROPOSAL_STATUS[status] ? PROPOSAL_STATUS[status] : "UNKNOWN";
    return typo;
  };

  const getProposalTypeTypo = (proposalType) => {
    const typo = PROPOSAL_MESSAGE_TYPE[proposalType] ? PROPOSAL_MESSAGE_TYPE[proposalType] : "UNKNOWN";
    return typo;
  };

  const isSpendCommunityPools = (type) => {
    return getProposalTypeTypo(type) === PROPOSAL_MESSAGE_TYPE_COMMUNITYPOOLSPEND;
  };

  const isChangeParameter = (type) => {
    return getProposalTypeTypo(type) === PROPOSAL_MESSAGE_TYPE_PARAMETERCHANGE;
  };

  const isSoftwareUpgrade = (type) => {
    return getProposalTypeTypo(type) === PROPOSAL_MESSAGE_TYPE_SOFTWAREUPGRADE;
  };

  const getTimeFormat = (time) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
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
          <ProposalContent>{getProposalTypeTypo(proposalState.proposalType)}</ProposalContent>
        </ProposalDetailItem>
        <ProposalDetailItem>
          <Label>Submit Time</Label>
          <ProposalContent>{getTimeFormat(proposalState.submitTime)}</ProposalContent>
        </ProposalDetailItem>
        <ProposalDetailItem>
          <Label>Description</Label>
          <ProposalContent>{proposalState.description}</ProposalContent>
        </ProposalDetailItem>

        {/* Spend Community Pools */}
        {isSpendCommunityPools(proposalState.proposalType) && (
          <>
            <ProposalDetailItem>
              <Label>Recipient</Label>
              <ProposalContent>{proposalState.extraData.recipient}</ProposalContent>
            </ProposalDetailItem>
            <ProposalDetailItem>
              <Label>Amount</Label>
              <ProposalContent>{`${numeral(proposalState.extraData.amount / 1000000).format(
                "0,0.00"
              )} FCT`}</ProposalContent>
            </ProposalDetailItem>
          </>
        )}
        {/* Change Parameters */}
        {isChangeParameter(proposalState.proposalType) && (
          <ProposalDetailItem>
            <Label>Change Prameters</Label>
            <ProposalContent>{JSON.stringify(proposalState.extraData.changes)}</ProposalContent>
          </ProposalDetailItem>
        )}
        {/* Software Upgrade Proposal */}
        {isSoftwareUpgrade(proposalState.proposalType) && (
          <>
            <ProposalDetailItem>
              <Label>Height</Label>
              <ProposalContent>{proposalState.extraData.height}</ProposalContent>
            </ProposalDetailItem>
            <ProposalDetailItem>
              <Label>Version</Label>
              <ProposalContent>{proposalState.extraData.name}</ProposalContent>
            </ProposalDetailItem>
            <ProposalDetailItem>
              <Label>Info</Label>
              <ProposalContent>{proposalState.extraData.info ? proposalState.extraData.info : "-"}</ProposalContent>
            </ProposalDetailItem>
          </>
        )}
      </ProposalDetailWrapper>
    </CardWrapper>
  );
};

export default ProposalDetailCard;
