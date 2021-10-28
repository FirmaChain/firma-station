import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";

import { PROPOSAL_STATUS } from "../../constants/government";
import { IProposalsState } from "./hooks";

import { ListWrapper, ItemWrapper, ItemColumn, TitleTypo, DescriptionTypo, StatusTypo } from "./styles";

interface IProps {
  proposalsState: IProposalsState;
}

const Row = ({ data, index, style }: any) => {
  const getStatusTypo = (status: string) => {
    const typo = PROPOSAL_STATUS[status] ? PROPOSAL_STATUS[status] : "UNKNOWN";
    return <StatusTypo>{typo}</StatusTypo>;
  };

  return (
    <ItemWrapper style={style}>
      <ItemColumn>{`# ${data[index].proposalId}`}</ItemColumn>
      <ItemColumn>{getStatusTypo(data[index].status)}</ItemColumn>
      <ItemColumn>{data[index].proposalType}</ItemColumn>

      <ItemColumn>
        <TitleTypo>
          <Link to={{ pathname: `/government/proposals/${data[index].proposalId}` }}>{data[index].title}</Link>
        </TitleTypo>
        <DescriptionTypo>{data[index].description}</DescriptionTypo>
      </ItemColumn>
    </ItemWrapper>
  );
};

const ProposalCard = ({ proposalsState }: IProps) => {
  return (
    <ListWrapper>
      <AutoSizer>
        {({ height, width }) => (
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
    </ListWrapper>
  );
};

export default React.memo(ProposalCard);
