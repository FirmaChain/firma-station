import React from "react";

import { PaperStyled, TabsStyled, TabStyled } from "./styles";

function CustomTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
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
}

export default CustomTabs;
