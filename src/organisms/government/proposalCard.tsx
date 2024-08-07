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
      <ItemWrapper style={style}>
        <ItemColumn>{`# ${currnetProposal.proposalId}`}</ItemColumn>
        <ItemColumn>{getStatusTypo(currnetProposal.status)}</ItemColumn>
        <ItemColumn>{getTypeTypo(currnetProposal.proposalType)}</ItemColumn>

        <ItemColumn>
          <TitleTypo>{currnetProposal.title}</TitleTypo>
          <DescriptionTypo>{currnetProposal.description}</DescriptionTypo>
        </ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const ProposalCard = ({ proposalsState }: IProps) => {
  const isSmall = useMediaQuery({ query: '(max-width: 900px)' });

  return (
    <ListWrapper>
      {isSmall ? (
        <SmallList>
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
                <SmallItemCard>
                  <SmallProposalId>{`# ${proposal.proposalId}`}</SmallProposalId>
                  <SmallProposalTitle>{proposal.title}</SmallProposalTitle>
                  <SmallProposalType>{getTypeTypo(proposal.proposalType)}</SmallProposalType>
                  <SmallProposalStatus>{getStatusTypo(proposal.status)}</SmallProposalStatus>
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
