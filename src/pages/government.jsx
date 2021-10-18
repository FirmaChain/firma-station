import React from "react";
import { useSelector } from "react-redux";

import { ContentContainer } from "styles/government";

const Government = (props) => {
  const { isInit } = useSelector((state) => state.wallet);

  return <ContentContainer></ContentContainer>;
};

export default React.memo(Government);
