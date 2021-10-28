import React from "react";

import { FooterContainer, FooterTypo } from "./styles";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTypo>Copyright ⓒ 2021 FirmaChain</FooterTypo>
      <FooterTypo>v0.0.1</FooterTypo>
    </FooterContainer>
  );
};

export default React.memo(Footer);
