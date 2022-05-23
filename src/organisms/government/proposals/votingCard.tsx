import React, { useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useMediaQuery } from "react-responsive";

import { rootState } from "../../../redux/reducers";
import { EXPLORER_URI, FIRMACHAIN_CONFIG } from "../../../config";
import { IProposalState, tally } from "../hooks";
import { convertNumber, convertToFctNumber, convertNumberFormat } from "../../../utils/common";
import { modalActions } from "../../../redux/action";
import { useAvataURL } from "../../header/hooks";

import {
  CardWrapper,
  VotingDetailWrapper,
  VotingDetailItem,
  VotingLabel,
  VotingContent,
  VotingMainTitle,
  VotingWrapper,
  VotingData,
  VotingType,
  VotingGauge,
  VotingPercent,
  VotingValue,
  VotingButton,
  VotingListWrap,
  VotingTabWrap,
  VotingTabItem,
  VotingList,
  ItemWrapper,
  ItemColumn,
  ProfileImage,
  Quorum,
  Arrow,
} from "./styles";
import { MultiGauge } from "../../../components/gauge";

interface IProps {
  proposalState: IProposalState;
}

const votingThemeData = [
  {
    type: "YES",
    key: "yes",
    option: "VOTE_OPTION_YES",
    color: "#2BA891",
  },
  {
    type: "NO",
    key: "no",
    option: "VOTE_OPTION_NO",
    color: "#F17047",
  },
  {
    type: "NoWithVeto",
    key: "noWithVeto",
    option: "VOTE_OPTION_NO_WITH_VETO",
    color: "#E79720",
  },
  {
    type: "Abstain",
    key: "abstain",
    option: "VOTE_OPTION_ABSTAIN",
    color: "#9438DC",
  },
];

const Row = ({ data, index, style }: any) => {
  const currentVoter = data[index];
  const { avatarURL, moniker } = useAvataURL(currentVoter.voterAddress);

  const getDotColor = (option: string) => {
    return votingThemeData.filter((v) => v.option === option)[0].color;
  };

  const getVotingText = (option: string) => {
    return votingThemeData.filter((v) => v.option === option)[0].type;
  };

  return (
    <Link to={{ pathname: `${EXPLORER_URI}/accounts/${currentVoter.voterAddress}` }} target={"_blank"}>
      <ItemWrapper style={style}>
        <ItemColumn>
          <ProfileImage src={avatarURL} />
        </ItemColumn>
        <ItemColumn>{`${moniker}`}</ItemColumn>
        <ItemColumn>
          <span style={{ color: `${getDotColor(currentVoter.option)}` }}>● </span>
          {getVotingText(currentVoter.option)}
        </ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const VotingCard = ({ proposalState }: IProps) => {
  const [currentVotingTab, setVotingTab] = useState(0);
  const { balance } = useSelector((state: rootState) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  const isSmall = useMediaQuery({ query: "(max-width: 900px)" });

  const getTallyPercent = (proposalState: IProposalState, targetKey: string) => {
    let currentVoting = 0;
    for (let value in proposalState.tally) {
      if (value === "abstain") continue;
      currentVoting += convertNumber(proposalState.tally[value]);
    }

    return proposalState.tally[targetKey] / currentVoting;
  };

  const getTallyValue = (proposalState: IProposalState, targetKey: string) => {
    return convertToFctNumber(proposalState.tally[targetKey]);
  };

  const votingData = [
    {
      percent: getTallyPercent(proposalState, "yes"),
      value: getTallyValue(proposalState, "yes"),
    },
    {
      percent: getTallyPercent(proposalState, "no"),
      value: getTallyValue(proposalState, "no"),
    },
    {
      percent: getTallyPercent(proposalState, "noWithVeto"),
      value: getTallyValue(proposalState, "noWithVeto"),
    },
    {
      percent: getTallyPercent(proposalState, "abstain"),
      value: getTallyValue(proposalState, "abstain"),
    },
  ];

  const voters = proposalState.voters.filter((v) => {
    if (currentVotingTab === 0) {
      return v;
    } else {
      return v.option === votingThemeData[currentVotingTab - 1].option;
    }
  });

  const getTimeFormat = (time: string) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss+00:00");
  };

  const getCurrentVotingPower = (tally: tally, totalVotingPower: number) => {
    let currentVoting = 0;
    for (let value in tally) {
      if (value === "abstain") continue;
      currentVoting += convertNumber(tally[value]);
    }

    return (currentVoting / totalVotingPower) * 100;
  };

  const getVotingCountByOption = (option: string) => {
    if (option === "ALL") return proposalState.voters.length;
    else return proposalState.voters.filter((v) => v.option === option).length;
  };

  const getMultiGaugeList = (proposalState: IProposalState) => {
    let result = [];
    let currentVoting = 0;
    for (let value in proposalState.tally) {
      if (value === "abstain") continue;
      currentVoting += convertNumber(proposalState.tally[value]);
    }

    for (let value in votingThemeData) {
      if (votingThemeData[value].key === "abstain") continue;
      result.push({
        percent: `${convertNumberFormat(proposalState.tally[votingThemeData[value].key] / currentVoting * 100, 2)}%`,
        bgColor: votingThemeData[value].color,
      });
    }

    return result;
  };

  const changeVotingTab = (index: number) => {
    setVotingTab(index);
  };

  const onClickVote = () => {
    if (convertNumber(balance) >= convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)) {
      modalActions.handleModalData({
        proposalId: proposalState.proposalId,
      });
      modalActions.handleModalVoting(true);
    } else {
      enqueueSnackbar("Insufficient funds. Please check your account balance.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <CardWrapper>
      <VotingMainTitle>Voting</VotingMainTitle>
      <VotingDetailWrapper>
        <VotingDetailItem>
          <VotingLabel>Voting Time</VotingLabel>
          <VotingContent>
            {isSmall ? (
              <>
                <div style={{ marginBottom: "5px" }}>{getTimeFormat(proposalState.votingStartTime)} ~</div>
                <div>{getTimeFormat(proposalState.votingEndTime)}</div>
              </>
            ) : (
              `${getTimeFormat(proposalState.votingStartTime)} ~ ${getTimeFormat(proposalState.votingEndTime)}`
            )}
          </VotingContent>
        </VotingDetailItem>
        <VotingDetailItem>
          <VotingLabel>Quorum</VotingLabel>
          <VotingContent bigSize={true}>{convertNumberFormat(proposalState.paramQuorum * 100, 2)}%</VotingContent>
        </VotingDetailItem>
        <VotingDetailItem>
          <VotingLabel>Current Turnout</VotingLabel>
          <VotingContent bigSize={true}>
            {convertNumberFormat(getCurrentVotingPower(proposalState.tally, proposalState.totalVotingPower), 2)}%
          </VotingContent>
        </VotingDetailItem>
        <VotingGauge>
          <MultiGauge
            percent={`${convertNumberFormat(
              getCurrentVotingPower(proposalState.tally, proposalState.totalVotingPower),
              2
            )}%`}
            multiList={getMultiGaugeList(proposalState)}
          ></MultiGauge>
          <Quorum>
            <Arrow>▲</Arrow>
            Quorum
          </Quorum>
        </VotingGauge>
      </VotingDetailWrapper>
      <VotingWrapper>
        {votingData.map((voting, index) => (
          <VotingData key={index}>
            <VotingType>
              <span style={{ color: `${votingThemeData[index].color}` }}>● </span>
              {votingThemeData[index].type}
            </VotingType>

            <VotingPercent>
              {votingThemeData[index].type !== "Abstain" ? `${convertNumberFormat(voting.percent * 100, 2)}%` : "ㅤ"}
            </VotingPercent>
            {/* <VotingGauge>
              <Gauge
                percent={`${convertNumberFormat(voting.percent * 100,2)}%`}
                bgColor={votingThemeData[index].color}
              />
            </VotingGauge> */}
            <VotingValue>{convertNumberFormat(voting.value, 0)}</VotingValue>
          </VotingData>
        ))}
      </VotingWrapper>
      {proposalState.status === "PROPOSAL_STATUS_VOTING_PERIOD" && (
        <VotingButton active={true} onClick={onClickVote}>
          Vote
        </VotingButton>
      )}
      {isSmall === false && (
        <VotingListWrap>
          <VotingTabWrap>
            <VotingTabItem active={currentVotingTab === 0} onClick={() => changeVotingTab(0)}>
              All ({getVotingCountByOption("ALL")})
            </VotingTabItem>
            <VotingTabItem active={currentVotingTab === 1} onClick={() => changeVotingTab(1)}>
              Yes ({getVotingCountByOption(votingThemeData[0].option)})
            </VotingTabItem>
            <VotingTabItem active={currentVotingTab === 2} onClick={() => changeVotingTab(2)}>
              No ({getVotingCountByOption(votingThemeData[1].option)})
            </VotingTabItem>
            <VotingTabItem active={currentVotingTab === 3} onClick={() => changeVotingTab(3)}>
              NoWithVeto ({getVotingCountByOption(votingThemeData[2].option)})
            </VotingTabItem>
            <VotingTabItem active={currentVotingTab === 4} onClick={() => changeVotingTab(4)}>
              Abstain ({getVotingCountByOption(votingThemeData[3].option)})
            </VotingTabItem>
          </VotingTabWrap>

          <VotingList>
            <AutoSizer>
              {({ height, width }) => (
                <List width={width} height={height} itemCount={voters.length} itemSize={50} itemData={voters}>
                  {Row}
                </List>
              )}
            </AutoSizer>
          </VotingList>
        </VotingListWrap>
      )}
    </CardWrapper>
  );
};

export default React.memo(VotingCard);
