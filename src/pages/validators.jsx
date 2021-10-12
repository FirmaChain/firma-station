import React from "react";
import { ContentContainer } from "styles/validstors";
import { ValidatorCard, DelegationCard } from "organisms/validators";

const Validators = (props) => {
  const { params } = props.match;
  return (
    <ContentContainer>
      <DelegationCard />
      <ValidatorCard />
    </ContentContainer>
  );
};

export default React.memo(Validators);
