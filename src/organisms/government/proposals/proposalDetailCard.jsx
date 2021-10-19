import React from "react";
import moment from "moment";
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
        typo = "Text Proposal";
        break;
      case "/cosmos.params.v1beta1.ParameterChangeProposal":
        typo = "Change Parameter";
        break;
      case "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal":
        typo = "Spend Community Pools";
        break;
      default:
        typo = "UNKNOWN";
    }

    return typo;
  };

  const getTimeFormat = (time) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss:ms");
  };

  return (
    <CardWrapper>
      {console.log(proposalState)}
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
      </DetailWrapper>
    </CardWrapper>
  );
};

export default ProposalDetailCard;
