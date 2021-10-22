import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  display: flex;
  padding: 24px;
  background-color: #1b1c22;
  flex-direction: column;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: stretch;
  padding: 14px 0;
  gap: 0 10px;
`;

const StatusWrapper = styled.div`
  width: 100%;
  display: flex;
  border-top: 1px solid #555;
  margin-top: 20px;
  padding: 24px 0 10px 0;
`;

const ProfileImageWrap = styled.div`
  width: 100px;
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: gray;
  margin-top: 8px;
`;
const DescriptionWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const NameTypo = styled.div`
  font-size: 24px;
  height: 50px;
  line-height: 50px;
  color: #eee;
`;
const DescriptionTypo = styled.div`
  font-size: 14px;
  line-height: 20px;
`;

const StatusItem = styled.div`
  width: 100%;
  text-align: center;
`;
const StatusTitle = styled.div`
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #888;
`;
const StatusContent = styled.div`
  height: 35px;
  line-height: 35px;
  font-size: 24px;
  color: #eee;
`;
const StatusSubContent = styled.div``;

const ValidatorCard = ({ validatorsState }) => {
  // const targetValidatorData = validatorsState.validators.map();
  const getValidatorAddress = () => {
    return window.location.pathname.replace("/staking/validators/", "");
  };
  return (
    <CardWrapper>
      <ProfileWrapper>
        <ProfileImageWrap>
          <ProfileImage />
        </ProfileImageWrap>
        <DescriptionWrap>
          <NameTypo>firma-node-1</NameTypo>
          <DescriptionTypo>
            <div>https://firmachain.org</div>
            <div>[firma node 1] validator</div>
            <div>[firma node 1] validator</div>

            <div>[firma node 1] validator</div>
            <div>[firma node 1] validator</div>
          </DescriptionTypo>
        </DescriptionWrap>
      </ProfileWrapper>
      <StatusWrapper>
        <StatusItem>
          <StatusTitle>Voting Power</StatusTitle>
          <StatusContent>33.3%</StatusContent>
          <StatusSubContent>1,293,123</StatusSubContent>
        </StatusItem>
        <StatusItem>
          <StatusTitle>Self-delegation</StatusTitle>
          <StatusContent>100%</StatusContent>
          <StatusSubContent>1,293,123</StatusSubContent>
        </StatusItem>
        <StatusItem>
          <StatusTitle>Commission</StatusTitle>
          <StatusContent>10%</StatusContent>
        </StatusItem>
        <StatusItem>
          <StatusTitle>Uptime</StatusTitle>
          <StatusContent>100%</StatusContent>
        </StatusItem>
      </StatusWrapper>
    </CardWrapper>
  );
};

export default ValidatorCard;
