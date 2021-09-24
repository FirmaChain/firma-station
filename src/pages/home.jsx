import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { PieChart, Pie, Cell } from "recharts";
import { BlankCard, SingleTitleCard } from "../components/card";
import { AessetTable } from "../components/table";
import { CustomTabs } from "../components/tab";

import theme from "../theme";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = [theme.colors.mainpurple, theme.colors.mainblue, theme.colors.maingreen, theme.colors.mainred];

const dashboardDataList = [
  { title: "Latest Block", content: "140184", bgColor: theme.colors.backgroundSideBar },
  { title: "Transactions", content: "12539", bgColor: theme.colors.backgroundSideBar },
  { title: "Inflation", content: "13.56 %", bgColor: theme.colors.backgroundSideBar },
];

const assets1 = [
  ["FCT", 10010],
  ["NFT [#300]", 1],
  ["NFT [#301]", 1],
];

const columns1 = [
  { name: "Name", align: "center" },
  { name: "Balances", align: "center" },
];

const assets2 = [
  ["1E5BFBF9...", "SEND", "firma1trqyle9...", "firma1pwlanx5...", "1000000 FCT", "2021-09-16 00:00:00"],
  ["1E5BFBF9...", "Create Contract File", "firma1trqyle9...", "firma1pwlanx5...", "1000000 FCT", "2021-09-16 00:00:00"],
  ["1E5BFBF9...", "Add Contract Log", "firma1trqyle9...", "firma1pwlanx5...", "1000000 FCT", "2021-09-16 00:00:00"],
  ["1E5BFBF9...", "NFT Transfer", "firma1trqyle9...", "firma1pwlanx5...", "1000000 FCT", "2021-09-16 00:00:00"],
];

const columns2 = [
  { name: "Hash", align: "center" },
  { name: "Type", align: "center", width: "130px" },
  { name: "From", align: "center" },
  { name: "To", align: "center" },
  { name: "Amount", align: "center" },
  { name: "Time", align: "center", width: "80px" },
];

const userInfo = {
  address: "firma1nssuz67am2uwc2hjgvphg0fmj3k9l6cx65ux9u",
  denom: "FCT",
  balance: "10010",
};

const ContentContainer = styled.div`
  z-index: 2;
  width: 100%;
  padding: 0 40px;
  height: calc(100% - 130px);
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
`;

const CardWrap = styled.div`
  position: relative;
  z-index: 50;
  height: 100%;
  display: flex;
  gap: 0 30px;
`;

const LeftCardWrap = styled.div`
  width: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px 0;
`;

const RightCardWrap = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px 0;
`;

const RightCardTopWrap = styled.div`
  width: 100%;
  min-height: 120px;
  max-height: 120px;
  height: 120px;
  display: flex;
  gap: 0 30px;
  box-shadow: 0;
`;

const RightCardMiddleWrap = styled.div`
  width: 100%;
  min-height: 168px;
  max-height: 168px;
  height: 168px;
  display: flex;
  gap: 0 30px;
`;

const StakingWrap = styled.div`
  width: calc(100% - 150px);
  height: 100%;
  float: left;
  display: flex;
`;

const StakingTextWrap = styled.div`
  width: 100%;
  margin: auto;
  flex: 1;
  text-align: center;
`;

function Home() {
  const useStyles = makeStyles({
    addressTitleTypo: {
      color: "white",
      height: "35px",
      lineHeight: "35px",
      fontSize: "20px",
      marginRight: "6px",
      float: "left",
    },
    addressTypo: {
      marginTop: "5px",
      width: "100%",
      height: "30px",
      lineHeight: "30px",
      fontSize: "11px",
      color: "#bbb",
      float: "left",
    },
    copyIcon: {
      height: "35px",
      lineHeight: "35px",
      fontSize: "20px",
      float: "left",
      cursor: "pointer",
    },
    defaultSymbol: {
      height: "20px",
      lineHeight: "20px",
      marginTop: "18px",
      marginBottom: "4px",
      width: "100%",
      fontSize: "16px",
      float: "left",
      textAlign: "left",
      color: theme.colors.gray1,
      fontWeight: "400",
    },
    defaultBalances: {
      height: "20px",
      lineHeight: "20px",
      width: "100%",
      fontSize: "20px",
      float: "left",
      textAlign: "left",
      fontWeight: "600",
      color: "white",
    },
    piechart: {
      float: "left",
    },
  });

  const classes = useStyles();

  return (
    <ContentContainer>
      <CardWrap>
        <LeftCardWrap>
          <BlankCard bgColor={theme.colors.mainblue} height="168px" backgroundLogo={true}>
            <Typography className={classes.addressTitleTypo}>Address</Typography>
            <FileCopyIcon className={classes.copyIcon}></FileCopyIcon>
            <Typography className={classes.addressTypo}>{userInfo.address}</Typography>
            <Typography className={classes.defaultSymbol}>{userInfo.denom}</Typography>
            <Typography className={classes.defaultBalances}>{userInfo.balance}</Typography>
          </BlankCard>
          <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
            <Typography className={classes.addressTitleTypo}>Assets</Typography>
            <AessetTable columns={columns1} assets={assets1} size="medium" />
          </BlankCard>
        </LeftCardWrap>
        <RightCardWrap>
          <RightCardMiddleWrap>
            <BlankCard bgColor={theme.colors.backgroundSideBar} height="168px" flex="2.08">
              <PieChart width={140} height={140} className={classes.piechart}>
                <Pie
                  data={data}
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <StakingWrap>
                <StakingTextWrap>
                  <Typography style={{ color: "#aaa", fontSize: "16px" }}>Available</Typography>
                  <Typography style={{ fontSize: "20px" }}>9000 FCT</Typography>
                </StakingTextWrap>
                <StakingTextWrap>
                  <Typography style={{ color: "#aaa", fontSize: "16px" }}>Delegated</Typography>
                  <Typography style={{ fontSize: "20px" }}>1010 FCT</Typography>
                </StakingTextWrap>
                <StakingTextWrap>
                  <Typography style={{ color: "#aaa", fontSize: "16px" }}>Unbonding</Typography>
                  <Typography style={{ fontSize: "20px" }}>0 FCT</Typography>
                </StakingTextWrap>
                <StakingTextWrap>
                  <Typography style={{ color: "#aaa", fontSize: "16px" }}>Staking Reward</Typography>
                  <Typography style={{ fontSize: "20px" }}>324.5 FCT</Typography>
                </StakingTextWrap>
              </StakingWrap>
            </BlankCard>
          </RightCardMiddleWrap>

          <RightCardTopWrap>
            {dashboardDataList.map(({ title, content, bgColor }, index) => {
              return <SingleTitleCard title={title} content={content} background={bgColor} key={index} height="100%" />;
            })}
          </RightCardTopWrap>

          <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
            <CustomTabs />
            <AessetTable columns={columns2} assets={assets2} size="small" />
          </BlankCard>
        </RightCardWrap>
      </CardWrap>
    </ContentContainer>
  );
}

export default React.memo(Home);
