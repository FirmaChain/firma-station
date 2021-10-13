import React from "react";
import { useSelector } from "react-redux";
import { ContentContainer } from "styles/validstors";
import { ValidatorCard, DelegationCard } from "organisms/validators";

const Validators = (props) => {
  const { params } = props.match;
  const { isInit } = useSelector((state) => state.wallet);
  return (
    <ContentContainer>
      {isInit && <DelegationCard />}
      <ValidatorCard />
    </ContentContainer>
  );
};

export default React.memo(Validators);
