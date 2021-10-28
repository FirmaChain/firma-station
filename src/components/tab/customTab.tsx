import React from "react";

import { PaperStyled, TabsStyled, TabStyled } from "./styles";

const CustomTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  };

  return (
    <PaperStyled elevation={0}>
      <TabsStyled value={value} onChange={handleChange}>
        <TabStyled label="History" />
        <TabStyled label="Send" />
      </TabsStyled>
    </PaperStyled>
  );
};

export default React.memo(CustomTabs);
