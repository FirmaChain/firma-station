import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { PROPOSAL_STATUS } from '../../constants/government';
import { IProposalsState } from '../../interfaces/governance';

import {
  ListWrapper,
  ItemWrapper,
  ItemColumn,
  TitleTypo,
  DescriptionTypo,
  StatusTypo,
  SmallList,
  SmallItemCard,
  SmallProposalId,
  SmallProposalTitle,
  SmallProposalType,
  SmallProposalStatus,
} from './styles';

interface IProps {
  proposalsState: IProposalsState;
}

interface IKeyValue {
  [key: string]: string;
}

const STATUS_COLOR: IKeyValue = {
  PROPOSAL_STATUS_DEPOSIT_PERIOD: '#2460FA',
  PROPOSAL_STATUS_VOTING_PERIOD: '#E79720',
  PROPOSAL_STATUS_PASSED: '#F17047',
  PROPOSAL_STATUS_REJECTED: '#DA4B4B',
  PROPOSAL_STATUS_FAILED: '#9438DC',
  PROPOSAL_STATUS_INVALID: '#2BA891',
};

const Row = ({ data, index, style }: any) => {
  const currnetProposal = data[index];

  const getStatusTypo = (status: string) => {
    const typo = PROPOSAL_STATUS[status] ? PROPOSAL_STATUS[status] : 'UNKNOWN';
    const color = STATUS_COLOR[status];
    return <StatusTypo statusColor={color}>{typo}</StatusTypo>;
  };

  const getTypeTypo = (type: string) => {
    const splitTypes = type.split('.');
    return splitTypes[splitTypes.length - 1].replace('Proposal', '');
  };

  return (
    <Link to={{ pathname: `/government/proposals/${currnetProposal.proposalId}` }} style={{ textDecoration: 'none' }}>
      <ItemWrapper style={style} data-testid={`proposal-item-${currnetProposal.proposalId}`}>
        <ItemColumn data-testid={`proposal-id-${currnetProposal.proposalId}`}>{`# ${currnetProposal.proposalId}`}</ItemColumn>
        <ItemColumn data-testid={`proposal-status-${currnetProposal.proposalId}`}>{getStatusTypo(currnetProposal.status)}</ItemColumn>
        <ItemColumn data-testid={`proposal-type-${currnetProposal.proposalId}`}>{getTypeTypo(currnetProposal.proposalType)}</ItemColumn>

        <ItemColumn data-testid={`proposal-content-${currnetProposal.proposalId}`}>
          <TitleTypo data-testid={`proposal-title-${currnetProposal.proposalId}`}>{currnetProposal.title}</TitleTypo>
          <DescriptionTypo data-testid={`proposal-description-${currnetProposal.proposalId}`}>{currnetProposal.description}</DescriptionTypo>
        </ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const ProposalCard = ({ proposalsState }: IProps) => {
  const isSmall = useMediaQuery({ query: '(max-width: 900px)' });

  return (
    <ListWrapper data-testid="proposals-list-wrapper">
      {isSmall ? (
        <SmallList data-testid="proposals-small-list">
          {proposalsState.proposals.map((proposal, i) => {
            const getStatusTypo = (status: string) => {
              const typo = PROPOSAL_STATUS[status] ? PROPOSAL_STATUS[status] : 'UNKNOWN';
              const color = STATUS_COLOR[status];
              return <StatusTypo statusColor={color}>{typo}</StatusTypo>;
            };

            const getTypeTypo = (type: string) => {
              const splitTypes = type.split('.');
              return splitTypes[splitTypes.length - 1].replace('Proposal', '');
            };

            return (
              <Link to={{ pathname: `/government/proposals/${proposal.proposalId}` }} key={i}>
                <SmallItemCard data-testid={`proposal-item-small-${proposal.proposalId}`}>
                  <SmallProposalId data-testid={`proposal-id-${proposal.proposalId}`}>{`# ${proposal.proposalId}`}</SmallProposalId>
                  <SmallProposalTitle data-testid={`proposal-title-${proposal.proposalId}`}>{proposal.title}</SmallProposalTitle>
                  <SmallProposalType data-testid={`proposal-type-${proposal.proposalId}`}>{getTypeTypo(proposal.proposalType)}</SmallProposalType>
                  <SmallProposalStatus data-testid={`proposal-status-${proposal.proposalId}`}>{getStatusTypo(proposal.status)}</SmallProposalStatus>
                </SmallItemCard>
              </Link>
            );
          })}
        </SmallList>
      ) : (
        <AutoSizer>
          {({ height, width }: any) => (
            <List
              width={width}
              height={height}
              itemCount={proposalsState.proposals.length}
              itemSize={130}
              itemData={proposalsState.proposals}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      )}
    </ListWrapper>
  );
};

export default React.memo(ProposalCard);
