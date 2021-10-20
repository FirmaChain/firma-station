import React from "react";
import moment from "moment";
import numeral from "numeral";
import styled from "styled-components";

const CardWrapper = styled.div`
  display: flex;
  padding: 24px;
  background-color: #1b1c22;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  gap: 0 10px;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #666;
`;
const ProposalID = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
`;
const Title = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  color: white;
`;
const Status = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #666;
`;

const DetailItem = styled.div`
  width: 100%;
  display: flex;
  font-size: 16px;
`;
const Label = styled.div`
  width: 200px;
  color: #808080;
`;
const Content = styled.div`
  width: 100%;
  color: #eee;
`;

const MainTitle = styled.div`
  font-size: 20px;
  color: #aaa;
`;

const ProposalDetailCard = ({ proposalState }) => {
  const getStatusTypo = (status) => {
    let typo = "";
    switch (status) {
      case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
        typo = "DEPOSIT";
        break;
      case "PROPOSAL_STATUS_VOTING_PERIOD":
        typo = "VOTING";
        break;
      case "PROPOSAL_STATUS_PASSED":
        typo = "PASSED";
        break;
      case "PROPOSAL_STATUS_REJECTED":
        typo = "REJECTED";
        break;
      case "PROPOSAL_STATUS_FAILED":
        typo = "FAILED";
        break;
      case "PROPOSAL_STATUS_INVALID":
        typo = "INVALID";
        break;
      default:
        typo = "UNKNOWN";
    }

    return typo;
  };

  const getProposalTypeTypo = (proposalType) => {
    let typo = "";
    switch (proposalType) {
      case "/cosmos.gov.v1beta1.TextProposal":
        typo = "Text";
        break;
      case "/cosmos.params.v1beta1.ParameterChangeProposal":
        typo = "ParameterChange";
        break;
      case "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal":
        typo = "CommunityPoolSpend";
        break;
      case "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal":
        typo = "SoftwareUpgrade";
        break;
      default:
        typo = "UNKNOWN";
    }

    return typo;
  };

  const isSpendCommunityPools = (type) => {
    return getProposalTypeTypo(type) === "Spend Community Pools";
  };

  const isChangeParameter = (type) => {
    return getProposalTypeTypo(type) === "Change Parameter";
  };

  const isSoftwareUpgrade = (type) => {
    return getProposalTypeTypo(type) === "Software Upgrade Proposal";
  };

  const getTimeFormat = (time) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <CardWrapper>
      <MainTitle>Proposal</MainTitle>
      <TitleWrapper>
        <ProposalID>#{proposalState.proposalId}</ProposalID>
        <Title>{proposalState.title}</Title>
        <Status>{getStatusTypo(proposalState.status)}</Status>
      </TitleWrapper>
      <DetailWrapper>
        <DetailItem>
          <Label>Proposal Type</Label>
          <Content>{getProposalTypeTypo(proposalState.proposalType)}</Content>
        </DetailItem>
        <DetailItem>
          <Label>Submit Time</Label>
          <Content>{getTimeFormat(proposalState.submitTime)}</Content>
        </DetailItem>
        <DetailItem>
          <Label>Description</Label>
          <Content>{proposalState.description}</Content>
        </DetailItem>

        {/* Spend Community Pools */}
        {isSpendCommunityPools(proposalState.proposalType) && (
          <>
            <DetailItem>
              <Label>Recipient</Label>
              <Content>{proposalState.extraData.recipient}</Content>
            </DetailItem>
            <DetailItem>
              <Label>Amount</Label>
              <Content>{`${numeral(proposalState.extraData.amount / 1000000).format("0,0.00")} FCT`}</Content>
            </DetailItem>
          </>
        )}
        {/* Change Parameters */}
        {isChangeParameter(proposalState.proposalType) && (
          <DetailItem>
            <Label>Change Prameters</Label>
            <Content>{JSON.stringify(proposalState.extraData.changes)}</Content>
          </DetailItem>
        )}
        {/* Software Upgrade Proposal */}
        {isSoftwareUpgrade(proposalState.proposalType) && (
          <>
            <DetailItem>
              <Label>Height</Label>
              <Content>{proposalState.extraData.height}</Content>
            </DetailItem>
            <DetailItem>
              <Label>Version</Label>
              <Content>{proposalState.extraData.name}</Content>
            </DetailItem>
            <DetailItem>
              <Label>Info</Label>
              <Content>{proposalState.extraData.info ? proposalState.extraData.info : "-"}</Content>
            </DetailItem>
          </>
        )}
      </DetailWrapper>
    </CardWrapper>
  );
};

export default ProposalDetailCard;
