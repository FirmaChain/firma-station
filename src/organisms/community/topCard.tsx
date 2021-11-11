import React from "react";

import { TopCardWrapper, TitleTypo, SubTitleTypo } from "./styles";

const TopCard = () => {
  return (
    <TopCardWrapper>
      <TitleTypo>Community</TitleTypo>
      <SubTitleTypo>Join our Community</SubTitleTypo>
    </TopCardWrapper>
  );
};

export default React.memo(TopCard);
