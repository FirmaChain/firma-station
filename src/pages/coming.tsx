import React from "react";
import { ContentContainer } from "../styles/home";
import { ComingDiv } from "../organisms/coming";

const Coming = () => {
  return (
    <ContentContainer>
      <ComingDiv />
    </ContentContainer>
  );
};

export default React.memo(Coming);
