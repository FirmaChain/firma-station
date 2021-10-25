import React from "react";
import numeral from "numeral";
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
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  ${(props) => props.src && `background-image:url('${props.src}')`}
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
  const getValidatorAddress = () => {
    return window.location.pathname.replace("/staking/validators/", "");
  };

  const [targetValidatorData] = validatorsState.validators.filter(
    (value) => value.validatorAddress === getValidatorAddress()
  );

  return (
    <CardWrapper>
      {targetValidatorData && (
        <>
          <ProfileWrapper>
            <ProfileImageWrap>
              <ProfileImage src={targetValidatorData.validatorAvatar} />
            </ProfileImageWrap>
            <DescriptionWrap>
              <NameTypo>{targetValidatorData.validatorMoniker}</NameTypo>
              <DescriptionTypo>{targetValidatorData.validatorDetail}</DescriptionTypo>
            </DescriptionWrap>
          </ProfileWrapper>
          <StatusWrapper>
            <StatusItem>
              <StatusTitle>Voting Power</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.votingPowerPercent * 1).format("0.00")} %`}</StatusContent>
              <StatusSubContent>{`${numeral(targetValidatorData.votingPower).format("0,0.00")} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Self-delegation</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.selfPercent * 1).format("0.00")} %`}</StatusContent>
              <StatusSubContent>{`${numeral(targetValidatorData.self / 1000000).format(
                "0,0.00"
              )} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Commission</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.commission * 1).format("0.00")} %`}</StatusContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Uptime</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.condition * 1).format("0.00")} %`}</StatusContent>
            </StatusItem>
          </StatusWrapper>
        </>
      )}
    </CardWrapper>
  );
};

export default ValidatorCard;
