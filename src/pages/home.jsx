import React from "react";
import theme from "../theme";
import { AccountCard, AssetCard, StakingCard, ChainCard, HistoryCard } from "../organisms/home";
import {
  ContentContainer,
  CardWrap,
  LeftCardWrap,
  RightCardWrap,
  RightCardTopWrap,
  RightCardMiddleWrap,
  RightCardBottomWrap,
} from "../styles/home";

const userInfo = {
  address: "firma1nssuz67am2uwc2hjgvphg0fmj3k9l6cx65ux9u",
  denom: "FCT",
  balance: "10010",
};

const assetData = {
  columns: [
    { name: "Name", align: "center" },
    { name: "Balances", align: "center" },
  ],
  data: [
    ["FCT", 10010],
    ["NFT [#300]", 1],
    ["NFT [#301]", 1],
  ],
};

const historyData = {
  columns: [
    { name: "Hash", align: "center" },
    { name: "Type", align: "center", width: "130px" },
    { name: "From", align: "center" },
    { name: "To", align: "center" },
    { name: "Amount", align: "center" },
    { name: "Time", align: "center", width: "80px" },
  ],
  data: [
    ["1E5BFBF9...", "SEND", "firma1trqyle9...", "firma1pwlanx5...", "1000000 FCT", "2021-09-16 00:00:00"],
    [
      "1E5BFBF9...",
      "Create Contract File",
      "firma1trqyle9...",
      "firma1pwlanx5...",
      "1000000 FCT",
      "2021-09-16 00:00:00",
    ],
    ["1E5BFBF9...", "Add Contract Log", "firma1trqyle9...", "firma1pwlanx5...", "1000000 FCT", "2021-09-16 00:00:00"],
    ["1E5BFBF9...", "NFT Transfer", "firma1trqyle9...", "firma1pwlanx5...", "1000000 FCT", "2021-09-16 00:00:00"],
  ],
};

const stakingData = [
  { name: "Available", value: 9000, color: theme.colors.mainblue },
  { name: "Delegated", value: 1000, color: theme.colors.mainpurple },
  { name: "Unbonding", value: 0, color: theme.colors.maingreen },
  { name: "Staking Reward", value: 350, color: theme.colors.mainred },
];

const chainData = [
  { title: "Latest Block", content: "140184", bgColor: theme.colors.backgroundSideBar },
  { title: "Transactions", content: "12539", bgColor: theme.colors.backgroundSideBar },
  { title: "Inflation", content: "13.56 %", bgColor: theme.colors.backgroundSideBar },
];

function Home() {
  return (
    <ContentContainer>
      <CardWrap>
        <LeftCardWrap>
          <AccountCard userInfo={userInfo} />
          <AssetCard assetData={assetData} />
        </LeftCardWrap>
        <RightCardWrap>
          <RightCardTopWrap>
            <StakingCard stakingData={stakingData} />
          </RightCardTopWrap>
          <RightCardMiddleWrap>
            <ChainCard chainData={chainData} />
          </RightCardMiddleWrap>
          <RightCardBottomWrap>
            <HistoryCard historyData={historyData} />
          </RightCardBottomWrap>
        </RightCardWrap>
      </CardWrap>
    </ContentContainer>
  );
}

export default React.memo(Home);
