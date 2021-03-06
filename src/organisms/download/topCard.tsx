import React from "react";

import { TopCardWrapper, TitleTypo, SubTitleTypo } from "./styles";

const TopCard = () => {
  return (
    <TopCardWrapper>
      <TitleTypo>Download</TitleTypo>
      <SubTitleTypo>Firma Station Desktop App</SubTitleTypo>
    </TopCardWrapper>
  );
};

export default React.memo(TopCard);
