import React from "react";

import { BackgroundImg, ComingTextTypo } from "./styles";

const ComingDiv = () => {
  return (
    <>
      <BackgroundImg />
      <ComingTextTypo>Under Development</ComingTextTypo>
    </>
  );
};

export default React.memo(ComingDiv);
