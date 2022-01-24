import React from "react";

import { FooterContainer, FooterTypo } from "./styles";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTypo>Copyright ⓒ 2021 FirmaChain</FooterTypo>
      <FooterTypo>v1.0.4</FooterTypo>
    </FooterContainer>
  );
};

export default React.memo(Footer);
