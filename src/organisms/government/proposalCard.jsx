import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

import { PROPOSAL_STATUS } from "constants/government";

const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-bottom: 1px solid #444;
`;

const ItemColumn = styled.div`
  width: 100%;
  padding-top: 8px;
  & {
    flex: 1 1 100%;
  }
  &:nth-child(1) {
    text-align: center;
    flex: 1 1 120px;
    line-height: 50px;
  }
  &:nth-child(2) {
  }
  &:nth-child(3) {
    text-align: center;
    flex: 1 1 300px;
    line-height: 50px;
  }
`;

const TitleTypo = styled.div`
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
  margin-top: 14px;
  color: white;
  & > a {
    &:hover {
      background: none;
    }
    text-decoration: none;
  }
`;

const DescriptionTypo = styled.div`
  display: block;
  font-size: 16px;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 20px;
  margin-top: 14px;
`;

const StatusTypo = styled.div`
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;
  border-radius: 4px;
  margin-top: 10px;
  color: #f17047;
  background: rgba(241, 112, 71, 0.2);
`;

const Row = ({ data, index, style }) => {
  const getStatusTypo = (status) => {
    const typo = PROPOSAL_STATUS[status] ? PROPOSAL_STATUS[status] : "UNKNOWN";
    return <StatusTypo>{typo}</StatusTypo>;
  };

  return (
    <ItemWrapper style={style}>
      <ItemColumn>{`# ${data[index].proposalId}`}</ItemColumn>
      <ItemColumn>
        <TitleTypo>
          <Link to={{ pathname: `/government/proposals/${data[index].proposalId}` }}>{data[index].title}</Link>
        </TitleTypo>
        <DescriptionTypo>{data[index].description}</DescriptionTypo>
      </ItemColumn>
      <ItemColumn>{getStatusTypo(data[index].status)}</ItemColumn>
    </ItemWrapper>
  );
};

const ProposalCard = ({ proposalsState }) => {
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

export default ProposalCard;
