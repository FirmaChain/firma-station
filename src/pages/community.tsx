import React from "react";

import { CommunityList, TopCard } from "../organisms/community";
import { ContentContainer } from "../styles/community";

const Community = () => {
  return (
    <ContentContainer>
      <TopCard />
      <CommunityList />
    </ContentContainer>
  );
};

export default React.memo(Community);
