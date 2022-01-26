import React from "react";

import { DownloadList, TopCard } from "../organisms/download";
import { ContentContainer } from "../styles/download";

const Download = () => {
  return (
    <ContentContainer>
      <TopCard />
      <DownloadList />
    </ContentContainer>
  );
};

export default React.memo(Download);
