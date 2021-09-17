import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import { BlankCard, SingleTitleCard } from "../components/card";

import theme from "../theme";

const dashboardDataList = [
  { title: "Latest Block", content: "140184", bgColor: theme.colors.backgroundSideBar },
  { title: "Transactions", content: "12539", bgColor: theme.colors.backgroundSideBar },
  { title: "Inflation", content: "140184", bgColor: theme.colors.backgroundSideBar },
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
  });

  const classes = useStyles();

  return (
    <ContentContainer>
      <CardWrap>
        <LeftCardWrap>
          <BlankCard bgColor={theme.colors.purple2} height="168px" background={true}>
            <Typography className={classes.addressTitleTypo}>Address</Typography>
            <FileCopyIcon className={classes.copyIcon}></FileCopyIcon>
            <Typography className={classes.addressTypo}>{userInfo.address}</Typography>
            <Typography className={classes.defaultSymbol}>{userInfo.denom}</Typography>
            <Typography className={classes.defaultBalances}>{userInfo.balance}</Typography>
          </BlankCard>
          <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%"></BlankCard>
        </LeftCardWrap>
        <RightCardWrap>
          <RightCardMiddleWrap>
            <BlankCard bgColor={theme.colors.backgroundSideBar} height="168px" flex="2.08"></BlankCard>
          </RightCardMiddleWrap>

          <RightCardTopWrap>
            {dashboardDataList.map(({ title, content, bgColor }, index) => {
              return <SingleTitleCard title={title} content={content} bgColor={bgColor} key={index} height="100%" />;
            })}
          </RightCardTopWrap>

          <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%"></BlankCard>
        </RightCardWrap>
      </CardWrap>
    </ContentContainer>
  );
}

export default React.memo(Home);
